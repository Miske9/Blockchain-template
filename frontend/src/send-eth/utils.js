// Pomocne funkcije za Send ETH: provjera adrese, pretvorba ETH -> wei i prikaz.

export function isAddress(value) {
  return /^0x[0-9a-fA-F]{40}$/.test(value)
}

// Pretvara decimalni iznos u ETH (npr. "0.01") u wei kao BigInt, bez gubitka preciznosti.
export function parseEther(value) {
  const text = String(value).trim().replace(',', '.')
  if (!/^\d+(\.\d+)?$/.test(text) && !/^\.\d+$/.test(text)) {
    throw new Error('Iznos mora biti pozitivan broj.')
  }
  const [whole = '0', fraction = ''] = text.split('.')
  if (fraction.length > 18) {
    throw new Error('Iznos smije imati najviše 18 decimala.')
  }
  return BigInt(whole || '0') * 10n ** 18n + BigInt(fraction.padEnd(18, '0'))
}

export function formatEther(wei) {
  const whole = wei / 10n ** 18n
  const fraction = (wei % 10n ** 18n).toString().padStart(18, '0').replace(/0+$/, '').slice(0, 6)
  return fraction ? `${whole}.${fraction}` : whole.toString()
}

export function shortAddress(address) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function txUrl(hash) {
  return `https://sepolia.etherscan.io/tx/${hash}`
}
