// Komunikacija s MetaMaskom preko EIP-1193 sucelja (window.ethereum), bez dodatnih biblioteka.
// Privatni kljucevi nikad ne prolaze kroz aplikaciju: MetaMask sam potpisuje transakcije.

export const SEPOLIA = {
  chainId: '0xaa36a7', // 11155111
  chainName: 'Sepolia',
  nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: ['https://rpc.sepolia.org'],
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
}

export function getProvider() {
  return typeof window !== 'undefined' ? window.ethereum : undefined
}

export async function connectWallet() {
  const provider = getProvider()
  if (!provider) {
    throw new Error('MetaMask nije pronađen. Instaliraj MetaMask ekstenziju i osvježi stranicu.')
  }
  const accounts = await provider.request({ method: 'eth_requestAccounts' })
  return accounts[0]
}

export async function getChainId() {
  return getProvider().request({ method: 'eth_chainId' })
}

// Prebacuje MetaMask na Sepoliju; ako mreza nije dodana (kod 4902), dodaje je.
export async function ensureSepolia() {
  const provider = getProvider()
  if ((await getChainId()) === SEPOLIA.chainId) return
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEPOLIA.chainId }],
    })
  } catch (error) {
    if (error.code !== 4902) throw error
    await provider.request({ method: 'wallet_addEthereumChain', params: [SEPOLIA] })
  }
}

export async function getBalance(address) {
  const hex = await getProvider().request({ method: 'eth_getBalance', params: [address, 'latest'] })
  return BigInt(hex)
}

export async function sendEth({ from, to, wei }) {
  await ensureSepolia()
  return getProvider().request({
    method: 'eth_sendTransaction',
    params: [{ from, to, value: '0x' + wei.toString(16) }],
  })
}

// Ceka da transakcija bude ukljucena u blok; vraca true ako je uspjela.
export async function waitForReceipt(hash, intervalMs = 3000) {
  const provider = getProvider()
  for (;;) {
    const receipt = await provider.request({ method: 'eth_getTransactionReceipt', params: [hash] })
    if (receipt) return receipt.status === '0x1'
    await new Promise((resolve) => setTimeout(resolve, intervalMs))
  }
}

export function errorMessage(error) {
  if (error?.code === 4001) return 'Zahtjev je odbijen u MetaMasku.'
  if (error?.code === -32002) return 'MetaMask već ima otvoren zahtjev. Otvori MetaMask i potvrdi ga.'
  return error?.message || 'Dogodila se nepoznata greška.'
}
