<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  SEPOLIA,
  connectWallet,
  ensureSepolia,
  errorMessage,
  getBalance,
  getChainId,
  getProvider,
  sendEth,
  waitForReceipt,
} from './ethereum.js'
import { formatEther, isAddress, parseEther, shortAddress, txUrl } from './utils.js'
import './send-eth.css'

const account = ref('')
const chainId = ref('')
const balance = ref(null)
const recipient = ref('')
const amount = ref('')
const status = ref('idle') // idle | connecting | signing | pending | success | failed
const message = ref('')
const txHash = ref('')

const onSepolia = computed(() => chainId.value === SEPOLIA.chainId)
const busy = computed(() => ['connecting', 'signing', 'pending'].includes(status.value))

async function refresh() {
  chainId.value = await getChainId()
  balance.value = account.value && onSepolia.value ? await getBalance(account.value) : null
}

async function connect() {
  status.value = 'connecting'
  message.value = ''
  try {
    account.value = await connectWallet()
    await ensureSepolia()
    await refresh()
    status.value = 'idle'
  } catch (error) {
    status.value = 'failed'
    message.value = errorMessage(error)
  }
}

async function switchNetwork() {
  try {
    await ensureSepolia()
    await refresh()
  } catch (error) {
    status.value = 'failed'
    message.value = errorMessage(error)
  }
}

async function submit() {
  message.value = ''
  txHash.value = ''
  const to = recipient.value.trim()
  if (!isAddress(to)) {
    status.value = 'failed'
    message.value = 'Adresa primatelja nije ispravna (0x + 40 heksadecimalnih znakova).'
    return
  }
  let wei
  try {
    wei = parseEther(amount.value)
  } catch (error) {
    status.value = 'failed'
    message.value = error.message
    return
  }
  if (wei <= 0n) {
    status.value = 'failed'
    message.value = 'Iznos mora biti veći od 0.'
    return
  }

  try {
    status.value = 'signing'
    txHash.value = await sendEth({ from: account.value, to, wei })
    status.value = 'pending'
    const ok = await waitForReceipt(txHash.value)
    status.value = ok ? 'success' : 'failed'
    message.value = ok ? `Poslano ${formatEther(wei)} ETH na ${shortAddress(to)}.` : 'Transakcija nije uspjela.'
    if (ok) amount.value = ''
    await refresh()
  } catch (error) {
    status.value = 'failed'
    message.value = errorMessage(error)
  }
}

function onAccountsChanged(accounts) {
  account.value = accounts[0] || ''
  refresh()
}

function onChainChanged(id) {
  chainId.value = id
  refresh()
}

onMounted(async () => {
  const provider = getProvider()
  if (!provider) return
  provider.on?.('accountsChanged', onAccountsChanged)
  provider.on?.('chainChanged', onChainChanged)
  // Ako je korisnik vec ranije dopustio pristup, odmah prikazi novcanik.
  const accounts = await provider.request({ method: 'eth_accounts' })
  if (accounts.length) onAccountsChanged(accounts)
})

onBeforeUnmount(() => {
  const provider = getProvider()
  provider?.removeListener?.('accountsChanged', onAccountsChanged)
  provider?.removeListener?.('chainChanged', onChainChanged)
})
</script>

<template>
  <div class="send-eth">
    <template v-if="!account">
      <button class="wallet-button" type="button" :disabled="busy" @click="connect">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20 8V5a2 2 0 0 0-2-2L5 6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h15V8H5a2 2 0 0 1 0-4" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
          <path d="M20 12h-5v5h5M17 14.5h.01" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ status === 'connecting' ? 'Spajanje…' : 'Spoji Novcanik' }}
        <svg class="arrow-icon button-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.5" /></svg>
      </button>
      <p class="button-note">Tvoja ulaznica u naš glazbeni svijet.</p>
      <p v-if="message" class="send-status failed" role="status">{{ message }}</p>
    </template>

    <div v-else class="send-card">
      <div class="wallet-info">
        <span class="status-dot" aria-hidden="true"></span>
        <span>Spojeno: <strong :title="account">{{ shortAddress(account) }}</strong></span>
        <span v-if="balance !== null" class="balance">{{ formatEther(balance) }} ETH</span>
      </div>

      <div v-if="!onSepolia" class="network-warning">
        <span>MetaMask nije na Sepolia mreži.</span>
        <button type="button" class="link-button" @click="switchNetwork">Prebaci na Sepoliju</button>
      </div>

      <form v-else class="send-form" @submit.prevent="submit">
        <label>
          Adresa primatelja
          <input v-model="recipient" type="text" placeholder="0x…" autocomplete="off" spellcheck="false" required :disabled="busy" />
        </label>
        <label>
          Iznos (ETH)
          <input v-model="amount" type="text" inputmode="decimal" placeholder="0.01" autocomplete="off" required :disabled="busy" />
        </label>
        <button class="wallet-button" type="submit" :disabled="busy">
          {{ status === 'signing' ? 'Potvrdi u MetaMasku…' : status === 'pending' ? 'Čeka se potvrda…' : 'Send ETH' }}
          <svg class="arrow-icon button-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.5" /></svg>
        </button>
      </form>

      <p v-if="message || txHash" class="send-status" :class="status" role="status">
        {{ message }}
        <a v-if="txHash" :href="txUrl(txHash)" target="_blank" rel="noopener">Pogledaj na Etherscanu</a>
      </p>
    </div>
  </div>
</template>

