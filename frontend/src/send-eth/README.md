# Send ETH (Sepolia)

Sve za gumb „Send ETH” nalazi se u ovoj mapi:

- `SendEth.vue` – komponenta: spajanje MetaMaska, provjera mreže, forma (primatelj + iznos) i status transakcije.
- `ethereum.js` – pozivi prema MetaMasku (`window.ethereum`): spajanje, prebacivanje na Sepoliju, slanje i čekanje potvrde.
- `utils.js` – provjera adrese, pretvorba ETH → wei (BigInt, bez gubitka preciznosti) i formatiranje.

Komponenta se koristi u `App.vue` (`<SendEth />`). Nema dodatnih biblioteka; transakcije potpisuje MetaMask, aplikacija nikad ne vidi privatni ključ.

## Kako isprobati
1. Instaliraj MetaMask i nabavi testni ETH sa Sepolia faucet-a.
2. `npm run dev` u mapi `frontend/`, klikni „Spoji Novcanik”.
3. Upiši adresu prijatelja i iznos, klikni „Send ETH” i potvrdi u MetaMasku.
