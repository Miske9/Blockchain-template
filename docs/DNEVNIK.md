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
- Što je AI napravio drugačije nego što sam očekivao: nije mi odmah dao lokalnu verziju nego mi je dao neki random github commit na kojem je spremio promjene koje je napravio, sve je stavio u istu datoteku.vue pa sam ja rastavio da css bude u različitoj datoteci, napravio mi je novi branch na Github a ja to nisam tražio
- Što sam dodao u AGENTS.md: /
- Provjera: Pokrenuo sam aplikaciju u web pregledniku Google Chrome i poslao sam prijatelju 0.01 SepoliaETH i provjerio sam sa njim stiglo mu je na wallet.
- Commit: 213bd6e

## T3 - Tokeni (02.11.2026.)

### Recenzija specifikacije (AI kritičar)

| Nalaz                                                                             | Odluka                | Obrazloženje                                                                                                                                                                                     |
| --------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| N1 – Posjetitelj u matrici smije kupiti note, a u ulogama "može samo čitati"      | prihvaćeno            | Adresa s bodovima je po definiciji polaznik. Ćelija za posjetitelja mijenja se u "ne smije (nema bodova)", a dodan je K16: kupnja sa saldom 0 pada s "Nedovoljno bodova".                        |
| N2 – Gubitak ključa je istodobno odluka i otvoreno pitanje                        | prihvaćeno            | Odluka ostaje (prijenos unaprijed, inače novi ugovor). Iz Otvorenih pitanja uklanjam to pitanje; ostaje samo kako prenijeti salda u novi ugovor.                                                 |
| N3 – "Administrator ne može ukloniti vlasnika" testira radnju koja ne postoji     | prihvaćeno            | Pravilo je preformulirano: administrator ne može pozvati ukloniAdministratora ni prenesiVlasnistvo. K9 je razdvojen na K9a i K9b s točnim pozivima.                                              |
| N5 – Nedostaje ERC-20 događaj Transfer i funkcija allowance                       | prihvaćeno            | Token je ERC-20, novčanici bez Transfer događaja ne vide salda. Kovanje emitira Transfer(0x0, polaznik, iznos), spaljivanje Transfer(polaznik, 0x0, iznos), allowance uvijek vraća 0. Dodan K17. |
| N9 – dodajAdministratora nema provjeru nulte adrese                               | prihvaćeno            | Nedosljedno s ostalim funkcijama. Dodana poruka "Neispravna adresa" i K18.                                                                                                                       |
| N19 – Administrator može povisiti cijenu prije kupnje, treba parametar maksCijena | odbijeno              | Administrator je nastavnik tečaja kojemu polaznici vjeruju, a cijene se mijenjaju rijetko. Dodatni parametar komplicira kupnju bez stvarne koristi za mali tečaj.                                |
| N4 – ograničenje 1–10 zaobilazi se s više poziva                                  | prihvaćeno            | Iz odluke uklonjeno "jedna dodjela = jedna vježba"; dnevni limit ostaje u Otvorenim pitanjima.                                                                                                   |
| N6/N17 – smije li administrator imati bodove                                      | odbijeno              | Administratori ne kupuju note; zloupotreba se rješava izvan lanca (vlasnik bira nastavnike).                                                                                                     |
| N7 – stari vlasnik nakon prijenosa ostaje administrator                           | prihvaćeno            | Izričito navedeno: administratorska uloga se ne mijenja prijenosom.                                                                                                                              |
| N8 – prijenos vlasništva u dva koraka                                             | odbijeno              | Izvan opsega za ovu vježbu.                                                                                                                                                                      |
| N10 – redoslijed provjera                                                         | prihvaćeno            | Redoslijed: ovlast → adresa → iznos → stanje.                                                                                                                                                    |
| N12 – ID-ovi nota                                                                 | prihvaćeno            | ID-ovi počinju od 1.                                                                                                                                                                             |
| N13 – događaj za promjenu cijene                                                  | prihvaćeno            | Dodan CijenaPromijenjena; povlačenje je trajno.                                                                                                                                                  |
| N14 – oporavak polaznika s izgubljenim ključem                                    | odbijeno              | Izvan opsega; administrator ručno dodijeli bodove na novu adresu.                                                                                                                                |
| N15 – duplikat naziva                                                             | odbijeno              | Dopušteno, note se razlikuju po ID-u.                                                                                                                                                            |
| N18 – oduzmiBodove bez traga                                                      | prihvaćeno            | Događaj BodoviOduzeti sadrži adresu administratora.                                                                                                                                              |
| N20/N31 – isporuka PDF-a                                                          | prihvaćeno            | Dodan procesni zahtjev: PDF se šalje u roku 3 radna dana.                                                                                                                                        |
| N24–N30 – neprovjerljivi kriteriji                                                | prihvaćeno djelomično | Definirani potpisi događaja, K8 i K15 precizirani.                                                                                                                                               |
| N11, N16, N21, N22, N23                                                           | odbijeno              | Rubni slučajevi niskog rizika za mali tečaj; ostaju poznata ograničenja.                                                                                                                         |

### Sljedivost ugovora

- Iznad svake funkcije u `contracts/HarmonikaUgovor.sol` dopisana je oznaka kriterija.
- Nalaz: ugovor iz OpenZeppelin `Ownable` nasljeđuje javne funkcije `transferOwnership` i `renounceOwnership`, koje nemaju kriterij. `transferOwnership` mijenja vlasnika bez provjere "Neispravna adresa" i bez događaja `VlasnistvoPreneseno`, a `renounceOwnership` zauvijek ostavlja ugovor bez vlasnika.
  - Kriv: kod. Naslijeđene funkcije nisu obrisive, zato su pregažene tako da uvijek padaju s "Koristi prenesiVlasnistvo".
  - SPEC: dodan K22 (funkcije, matrica ovlasti, kriteriji, sljedivost) i test.

### Provjera u Remixu

Postavljanje: Remix VM, objavljen `HarmonikaUgovor` s Account 1 (vlasnik). Zatim Account 1 pozvao `dodajAdministratora(<Account 2>)`.

| Kriterij | Što sam kliknuo                                                                                      | Očekivano                                                  | Dobiveno (poruka iz konzole)                                                                                                                                          |
| -------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| K1       | S Account 2 (administrator) pozvao `dodijeliBodove(<Account 3>, 10)`, zatim `balanceOf(<Account 3>)` | Uspjeh, emitiran `BodoviDodijeljeni`, `balanceOf` vraća 10 | Uspjeh, `"event": "BodoviDodijeljeni"`, `"args": { "0": "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", "1": "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", "2": "10" }` |
| K2       | S Account 4 (nije administrator) pozvao `dodijeliBodove(<Account 3>, 5)`                             | Pada: "Samo administrator"                                 | Reason provided by the contract: "Samo administrator".                                                                                                                |
| K3       | S Account 2 (administrator) pozvao `dodijeliBodove(<Account 3>, 11)`                                 | Pada: "Iznos mora biti od 1 do 10"                         | Reason provided by the contract: "Iznos mora biti od 1 do 10".                                                                                                        |

Nalazi iz Remixa: "nema odstupanja"
commit: 508801c

## Vježba 4: testovi

- Prompt:
  "U docs/SPEC.md su kriteriji prihvaćanja za token (K1, K2, ...), a u
  contracts/HarmonikaUgovorToken.sol je ugovor.
  Napiši Hardhat 3 testove u test/HarmonikaUgovor.test.js: JavaScript (ne TypeScript),
  ESM,
  mocha + chai, ethers v6, na početku:
  import { network } from "hardhat"; const { ethers } = await
  network.connect();
  Pravila: - jedan it() po kriteriju tokena, naziv počinje oznakom kriterija (npr. "K3:
  ..."); - za neuspješne kriterije koristi revertedWith s točnom porukom iz ugovora; - za događaje koristi emit(...).withArgs(...); - svaki test sam priprema stanje u beforeEach, bez ovisnosti o drugim
  testovima; - ne mijenjaj ugovor; ako kriterij nije moguće testirati, napiši to kao
  komentar."
- Testova: 49, prolazi: 49
- Greška AI-ja koju sam uočio: Ovaj put je sve napravio ispravno nakon promptanja, nije radio greske
- Mutacijska provjera: maknuo sam require "require(msg.sender == owner(), "Samo vlasnik");", pao je test "K9a, K15, K9b"

commit za hardhat projekt: 0e474cd

## Vježba 4: objava na lokalnoj mreži

- Contract deployment: HarmonikaUgovor
- Contract address: 0x5fbdb2315678afecb367f032d93f642f64180aa3
- Transaction: 0xbebef8b2541a5121db21a56e845adb38765a81b8c664aed30fd35d34f7a7deeb
- From: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
- Value: 0 ETH
- Gas used: 1720799 of 1720799
- Block #1: 0x324627a57fbc02931720ce9e68cc82ea271e25f3e5bfa573cd77dd6eede35f54

- Zašto objava troši gas, a čitanje salda ne?
  Objava zapisuje ugovor na lanac, a svako pisanje se plaća gas, dok čitanje salda ništa ne mijenja pa je besplatno.
- Zašto je druga transakcija (postaviAdministratora) potrošila puno manje
  gasa od objave?
  Druga transakcija zapiše samo jedan podataka (tko je administrator), a objava zapiše cijeli kod ugovora.
- Što bi se dogodilo s ugovorom da sad ugasim npx hardhat node?
  Ugovor bi nestao, jer je to lokalno i lokalni Hardhat lanac postoji samo dok node radi.

commit: 36ac1be
