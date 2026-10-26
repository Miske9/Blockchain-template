# AI dnevnik

## T1 — Postavljanje projekta (19.10.2026)

- Cilj termina: Upoznavanje sa promtanjem AI
- Najkorisniji prompt (kopiran u cijelosti):
  Projekt je Vue 3 aplikacija u mapi frontend/(script setup, Vite); ako mapa frontend ne postoji kreiraj je; pravila su u AGENTS.md
  Zadatak: preuredi pocetnu stranicu za jedan frontend za aplikaciju Harmonika
  Sadrzaj: naziv aplikacije stavi Harmonika, par recenica o tome kakav je to instrument i kako se koristi, i gumb "Spoji Novcanik" koji zasad ispisuje poruku "novcanik" u konzolu
  Ogranicenja: nemoj dodavati nove biblioteke bez dopustenja, sav tekst neka bude na hrvatskom jeziku, primjere koje je napravio create-vue (helloWorld, TheWelcome) ukloni
- Što je AI napravio dobro: Napravio je bolju stranicu nego sto sam ocekivao, pitao me ako potvrdujem plan, nije bilo gresaka za pokretanje aplikaciju
- Što je AI napravio drugačije nego što sam očekivao: nije mi odmah dao lokalnu verziju aplikacije nego mi je dao cloud verziju i pregled u pregledniku
- Što sam dodao u AGENTS.md: /
- Provjera: Pokrenuo sam aplikaciju u pregledniku i sve radi kako treba
- Commit: fa1f661

## T2 — MetaMask i SepoliaETH (26.10.2026.)

- Cilj termina: Izrada MetaMask wallet-a i transfer SepoliaETH između korisnika
- Najkorisniji prompt (kopiran u cijelosti):
  Implementiraj gumb „Send ETH” na postojećem frontendu koji omogućuje slanje testnog ETH-a na Sepolia mreži preko MetaMask walleta. Omogući da spojim svoj novčanik i da mogu poslati prijatelju neku količinu koju ja odredim. Napravi mapu u projektnom direktoriju u kojoj spremas datoteke za taj gumb i sve funkcionalnosti vezane uz gumb. Upute su u agents.md
- Što je AI napravio dobro: Pitao me za potvrdu plana, organizirao kod u zasebnu mapu, pokretanje radi bez greške, testna transakcija je prošla bez problema
- Što je AI napravio drugačije nego što sam očekivao: nije mi odmah dao lokalnu verziju nego mi je dao neki random github commit na kojem je spremio promjene koje je napravio, sve je stavio u istu datoteku.vue pa sam ja rastavio da css bude u različitoj datoteci
- Što sam dodao u AGENTS.md: /
- Provjera: Pokrenuo sam aplikaciju u web pregledniku Google Chrome i poslao sam prijatelju 0.01 SepoliaETH i provjerio sam sa njim stiglo mu je na wallet.
- Commit:
