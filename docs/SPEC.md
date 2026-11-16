# Specifikacija: Harmonika bodovi – nagradna trgovina nota

## Opis

Aplikacija za tečaj harmonike. Polaznici za svaku završenu vježbu dobivaju bodove (token HBOD) od administratora. Bodove mogu potrošiti u nagradnoj trgovini na digitalne note (PDF) za određene pjesme. PDF se polazniku šalje e-mailom izvan lanca.

## Korisnici i uloge

| Uloga         | Opis                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| Vlasnik       | Voditelj tečaja; adresa koja je objavila ugovor. Upravlja administratorima i može prenijeti vlasništvo. |
| Administrator | Nastavnik; dodjeljuje i oduzima bodove, upravlja notama u trgovini.                                     |
| Polaznik      | Adresa s bodovima; kupuje note.                                                                         |
| Posjetitelj   | Bilo koja adresa; može samo čitati javne podatke (salda, popis nota).                                   |

## Odluke o tokenu

- **Naziv, oznaka, decimale:** Harmonika bodovi, HBOD, 0 decimala (1 bod = broj 1).
- **Izdavanje:** samo administrator, od 1 do 10 bodova po jednoj dodjeli (jedna vježba). Administrator ne može dodijeliti bodove sam sebi.
- **Ukupna količina:** nema gornje granice, jer se broj polaznika i vježbi ne zna unaprijed.
- **Prenosivost:** bodovi nisu prenosivi; `transfer`, `transferFrom` i `approve` padaju s porukom "Bodovi nisu prenosivi".
- **Trošenje:** bodovi se spaljuju kupnjom nota (pokreće polaznik). Administrator može oduzeti (spaliti) bodove polazniku, najviše onoliko koliko polaznik ima.
- **Administratori:** samo vlasnik dodaje i uklanja administratore. Administrator ne može ukloniti vlasnika ni dodati/ukloniti drugog administratora.
- **Gubitak ključa:** vlasnik može unaprijed prenijeti vlasništvo na novu adresu. Ako ključ izgubi bez prijenosa, objavljuje se novi ugovor (vidi Otvorena pitanja).

## Odluke o modulu

Modul: **Nagradna trgovina** (digitalne note).

- **Tko dodaje nagrade i cijenu:** samo administrator; note imaju naziv pjesme i cijenu u bodovima (najmanje 1). Administrator može promijeniti cijenu i povući note iz prodaje.
- **Zaliha:** nema zalihe, PDF je digitalan. Isti polaznik iste note može kupiti samo jednom.
- **Potrošeni bodovi:** spaljuju se (smanjuje se ukupna količina).
- **Preuzimanje izvan lanca:** kupnja emitira događaj s adresom kupca i ID-om nota; administrator provjeri događaj i pošalje PDF e-mailom.
- **Poništenje kupnje:** nije moguće, kupnja je konačna.

## Funkcije

**dodijeliBodove(polaznik, iznos)**

- Smije: administrator
- Radi: povećava saldo polaznika za iznos; emitira `BodoviDodijeljeni`.
- Pada: nije administrator → "Samo administrator"; iznos < 1 ili > 10 → "Iznos mora biti od 1 do 10"; polaznik je pozivatelj → "Administrator ne moze sebi dodijeliti bodove"; nulta adresa → "Neispravna adresa".

**oduzmiBodove(polaznik, iznos)**

- Smije: administrator
- Radi: smanjuje (spaljuje) saldo polaznika; emitira `BodoviOduzeti`.
- Pada: nije administrator → "Samo administrator"; iznos > saldo → "Nedovoljno bodova"; iznos = 0 → "Iznos mora biti veci od 0".

**dodajAdministratora(adresa) / ukloniAdministratora(adresa)**

- Smije: vlasnik
- Radi: dodaje/uklanja ulogu administratora; emitira `AdministratorDodan` / `AdministratorUklonjen`.
- Pada: nije vlasnik → "Samo vlasnik"; adresa je već administrator → "Vec je administrator"; adresa nije administrator → "Nije administrator".

**prenesiVlasnistvo(novaAdresa)**

- Smije: vlasnik
- Radi: postavlja novog vlasnika; emitira `VlasnistvoPreneseno`.
- Pada: nije vlasnik → "Samo vlasnik"; nulta adresa → "Neispravna adresa".

**dodajNote(nazivPjesme, cijena)**

- Smije: administrator
- Radi: dodaje note s novim ID-om, aktivne za prodaju; emitira `NoteDodane`.
- Pada: nije administrator → "Samo administrator"; cijena = 0 → "Cijena mora biti barem 1"; prazan naziv → "Naziv je obavezan".

**promijeniCijenu(idNota, novaCijena)**

- Smije: administrator
- Pada: nije administrator → "Samo administrator"; ne postoje → "Note ne postoje"; cijena = 0 → "Cijena mora biti barem 1".

**povuciNote(idNota)**

- Smije: administrator
- Radi: note više nisu u prodaji.
- Pada: nije administrator → "Samo administrator"; ne postoje → "Note ne postoje".

**kupiNote(idNota)**

- Smije: bilo koja adresa s dovoljno bodova
- Radi: spaljuje cijenu u bodovima, bilježi kupnju; emitira `NoteKupljene(kupac, idNota, cijena)`.
- Pada: ne postoje → "Note ne postoje"; povučene → "Note nisu u prodaji"; već kupljene → "Note su vec kupljene"; saldo < cijena → "Nedovoljno bodova".

**transfer / transferFrom / approve**

- Smije: nitko
- Pada uvijek: "Bodovi nisu prenosivi".

**balanceOf, totalSupply, name, symbol, decimals, dohvatiNote, jeKupio**

- Smije: svi (samo čitanje).

## Matrica ovlasti

| Funkcija                          | Vlasnik                | Administrator          | Polaznik | Posjetitelj            |
| --------------------------------- | ---------------------- | ---------------------- | -------- | ---------------------- |
| dodijeliBodove                    | ne smije\*             | smije (ne sebi)        | ne smije | ne smije               |
| oduzmiBodove                      | ne smije\*             | smije                  | ne smije | ne smije               |
| dodajAdministratora               | smije                  | ne smije               | ne smije | ne smije               |
| ukloniAdministratora              | smije                  | ne smije               | ne smije | ne smije               |
| prenesiVlasnistvo                 | smije                  | ne smije               | ne smije | ne smije               |
| dodajNote                         | ne smije\*             | smije                  | ne smije | ne smije               |
| promijeniCijenu                   | ne smije\*             | smije                  | ne smije | ne smije               |
| povuciNote                        | ne smije\*             | smije                  | ne smije | ne smije               |
| kupiNote                          | smije (ako ima bodove) | smije (ako ima bodove) | smije    | smije (ako ima bodove) |
| transfer / transferFrom / approve | ne smije               | ne smije               | ne smije | ne smije               |
| funkcije za čitanje               | smije                  | smije                  | smije    | smije                  |

\* Vlasnik te radnje smije samo ako sam sebe doda kao administratora.

## Model podataka na lancu

- `vlasnik`: adresa
- `administratori`: mapiranje adresa → bool
- `salda`: mapiranje adresa → broj bodova (uint256)
- `ukupnaKolicina`: uint256
- `note`: mapiranje idNota → { nazivPjesme (string), cijena (uint256), uProdaji (bool) }
- `brojNota`: uint256 (sljedeći ID)
- `kupljeno`: mapiranje adresa → idNota → bool
- Događaji: `BodoviDodijeljeni`, `BodoviOduzeti`, `AdministratorDodan`, `AdministratorUklonjen`, `VlasnistvoPreneseno`, `NoteDodane`, `NoteKupljene`

## Što se NE sprema na blockchain

- Ime, prezime i e-mail polaznika (evidencija tečaja izvan lanca, GDPR)
- Sami PDF-ovi nota
- Koju je točno vježbu polaznik završio i ocjene nastavnika
- Povezanost adrese s osobom

## Kriteriji prihvaćanja

- **K1:** Zadano polaznik ima 0 bodova, kada administrator dodijeli 10 bodova, tada polaznik ima 10 bodova i emitiran je `BodoviDodijeljeni`.
- **K2:** Zadano adresa nije administrator, kada pokuša dodijeliti 5 bodova, tada transakcija pada s porukom "Samo administrator".
- **K3:** Zadano polaznik ima 0 bodova, kada administrator dodijeli 11 bodova, tada transakcija pada s porukom "Iznos mora biti od 1 do 10".
- **K4:** Zadano administrator, kada sebi pokuša dodijeliti 5 bodova, tada transakcija pada s porukom "Administrator ne moze sebi dodijeliti bodove".
- **K5:** Zadano polaznik ima 10 bodova, kada pokuša poslati 5 bodova drugoj adresi (transfer ili transferFrom), tada transakcija pada s porukom "Bodovi nisu prenosivi".
- **K6:** Zadano polaznik ima 10 bodova, kada administrator oduzme 4 boda, tada polaznik ima 6 bodova i ukupna količina je manja za 4.
- **K7:** Zadano polaznik ima 3 boda, kada administrator pokuša oduzeti 5, tada transakcija pada s porukom "Nedovoljno bodova".
- **K8:** Zadano adresa nije administrator, kada je vlasnik doda kao administratora, tada ta adresa može dodijeliti bodove.
- **K9:** Zadano administrator, kada pokuša dodati drugog administratora ili ukloniti vlasnika, tada transakcija pada s porukom "Samo vlasnik".
- **K10:** Zadano administrator, kada doda note "Oj Dunave" s cijenom 15, tada note postoje, u prodaji su i emitiran je `NoteDodane`.
- **K11:** Zadano polaznik ima 20 bodova i note koštaju 15, kada kupi note, tada polaznik ima 5 bodova, ukupna količina je manja za 15 i emitiran je `NoteKupljene` s njegovom adresom i ID-om nota.
- **K12:** Zadano polaznik ima 10 bodova i note koštaju 15, kada pokuša kupiti note, tada transakcija pada s porukom "Nedovoljno bodova".
- **K13:** Zadano polaznik je već kupio note, kada ih pokuša kupiti ponovno, tada transakcija pada s porukom "Note su vec kupljene".
- **K14:** Zadano note su povučene iz prodaje, kada ih polaznik pokuša kupiti, tada transakcija pada s porukom "Note nisu u prodaji".
- **K15:** Zadano vlasnik, kada prenese vlasništvo na novu adresu, tada stara adresa više ne može dodati administratora ("Samo vlasnik"), a nova može.

## Izvan opsega

- Prodaja ili kupnja bodova za novac ili ETH
- Prijenos bodova između polaznika
- Poništenje kupnje i povrat bodova
- Tiskane note i zaliha
- NFT-ovi, glasanje, skupljanje sredstava
- Automatsko slanje PDF-a iz ugovora

## Otvorena pitanja

- Gubitak ključa vlasnika bez prethodnog prijenosa: treba li drugi oblik oporavka (npr. više vlasnika) ili se prihvaća objava novog ugovora i ponovna dodjela salda?
- Treba li ograničiti koliko puta dnevno administrator može dodijeliti bodove istom polazniku?

## Sljedivost

(popunjava se u Dijelu 4)
