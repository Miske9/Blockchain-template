// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Harmonika bodovi (HBOD) – token, uloge i administracija
/// @notice Neprenosivi bodovi za polaznike tečaja harmonike. 0 decimala.
/// @dev Izvor: docs/SPEC.md. Samostalno sučelje (ne nasljeđuje OpenZeppelin IERC20),
///      ali s ERC-20 potpisima radi kompatibilnosti s novčanicima i alatima.
interface IHarmonikaBodoviToken {
    // ─────────────────────────────── Događaji ───────────────────────────────

    /// @notice ERC-20 događaj. Dodjela: Transfer(0x0, polaznik, iznos);
    ///         oduzimanje i kupnja: Transfer(polaznik, 0x0, iznos).
    /// SPEC: K17
    event Transfer(address indexed od, address indexed prema, uint256 iznos);

    /// @notice ERC-20 događaj; deklariran radi sukladnosti sa standardom.
    /// @dev Nikad se ne emitira jer approve uvijek pada.
    /// SPEC: nema kriterija
    event Approval(address indexed vlasnikBodova, address indexed potrosac, uint256 iznos);

    /// SPEC: K1
    event BodoviDodijeljeni(address indexed administrator, address indexed polaznik, uint256 iznos);

    /// SPEC: nema kriterija
    event BodoviOduzeti(address indexed administrator, address indexed polaznik, uint256 iznos);

    /// SPEC: K8
    event AdministratorDodan(address indexed adresa);

    /// SPEC: nema kriterija
    event AdministratorUklonjen(address indexed adresa);

    /// SPEC: K15
    event VlasnistvoPreneseno(address indexed stari, address indexed novi);

    // ───────────────────────── ERC-20: samo čitanje ─────────────────────────

    /// Smije: svi (samo čitanje). Vraća "Harmonika bodovi".
    /// SPEC: nema kriterija
    function name() external view returns (string memory);

    /// Smije: svi (samo čitanje). Vraća "HBOD".
    /// SPEC: nema kriterija
    function symbol() external view returns (string memory);

    /// Smije: svi (samo čitanje). Vraća 0.
    /// SPEC: nema kriterija
    function decimals() external view returns (uint8);

    /// Smije: svi (samo čitanje).
    /// SPEC: K6, K11
    function totalSupply() external view returns (uint256);

    /// Smije: svi (samo čitanje).
    /// SPEC: K1, K6, K7, K8, K11, K12, K16
    function balanceOf(address racun) external view returns (uint256);

    /// Smije: svi (samo čitanje). Uvijek vraća 0.
    /// SPEC: nema kriterija
    function allowance(address vlasnikBodova, address potrosac) external view returns (uint256);

    // ───────────────────── ERC-20: prijenos (uvijek pada) ─────────────────────

    /// Smije: nitko. Uvijek pada s "Bodovi nisu prenosivi".
    /// SPEC: K5
    function transfer(address prema, uint256 iznos) external returns (bool);

    /// Smije: nitko. Uvijek pada s "Bodovi nisu prenosivi".
    /// SPEC: K5
    function transferFrom(address od, address prema, uint256 iznos) external returns (bool);

    /// Smije: nitko. Uvijek pada s "Bodovi nisu prenosivi".
    /// SPEC: nema kriterija
    function approve(address potrosac, uint256 iznos) external returns (bool);

    // ──────────────────────────────── Bodovi ────────────────────────────────

    /// Smije: administrator (ne sebi). Iznos od 1 do 10.
    /// SPEC: K1, K2, K3, K4, K8, K17
    function dodijeliBodove(address polaznik, uint256 iznos) external;

    /// Smije: administrator. Iznos najviše do salda polaznika.
    /// SPEC: K6, K7
    function oduzmiBodove(address polaznik, uint256 iznos) external;

    // ──────────────────────────── Uloge i vlasništvo ────────────────────────────

    /// Smije: vlasnik.
    /// SPEC: K8, K9a, K15, K18
    function dodajAdministratora(address adresa) external;

    /// Smije: vlasnik.
    /// SPEC: K9b
    function ukloniAdministratora(address adresa) external;

    /// Smije: vlasnik. Ne mijenja administratorske uloge.
    /// SPEC: K15
    function prenesiVlasnistvo(address novaAdresa) external;

    /// Smije: svi (samo čitanje).
    /// SPEC: K15
    function vlasnik() external view returns (address);

    /// Smije: svi (samo čitanje).
    /// SPEC: K8, K9b, K15
    function jeAdministrator(address adresa) external view returns (bool);
}

/// @title Harmonika bodovi – nagradna trgovina nota
/// @notice Polaznici troše (spaljuju) bodove na digitalne note; PDF se šalje izvan lanca.
/// @dev Izvor: docs/SPEC.md. ID-ovi nota počinju od 1.
interface IHarmonikaBodoviModul {
    // ─────────────────────────────── Događaji ───────────────────────────────

    /// SPEC: K10
    event NoteDodane(uint256 indexed id, string naziv, uint256 cijena);

    /// SPEC: nema kriterija
    event CijenaPromijenjena(uint256 indexed id, uint256 staraCijena, uint256 novaCijena);

    /// SPEC: K14
    event NotePovucene(uint256 indexed id);

    /// @notice Administrator na temelju ovog događaja šalje PDF e-mailom (rok 3 radna dana).
    /// SPEC: K11
    event NoteKupljene(address indexed kupac, uint256 indexed id, uint256 cijena);

    // ──────────────────────────── Upravljanje notama ────────────────────────────

    /// Smije: administrator. Cijena najmanje 1, naziv obavezan. Note su odmah u prodaji.
    /// SPEC: K10
    function dodajNote(string calldata nazivPjesme, uint256 cijena) external returns (uint256 idNota);

    /// Smije: administrator. Nova cijena najmanje 1.
    /// SPEC: nema kriterija
    function promijeniCijenu(uint256 idNota, uint256 novaCijena) external;

    /// Smije: administrator. Note trajno više nisu u prodaji.
    /// SPEC: K14
    function povuciNote(uint256 idNota) external;

    // ──────────────────────────────── Kupnja ────────────────────────────────

    /// Smije: bilo koja adresa s dovoljno bodova (vlasnik, administrator, polaznik).
    /// Posjetitelj (saldo 0) ne može. Kupnja je konačna; bodovi se spaljuju.
    /// SPEC: K11, K12, K13, K14, K16, K17
    function kupiNote(uint256 idNota) external;

    // ─────────────────────────────── Čitanje ───────────────────────────────

    /// Smije: svi (samo čitanje).
    /// SPEC: K10
    function dohvatiNote(uint256 idNota)
        external
        view
        returns (string memory nazivPjesme, uint256 cijena, bool uProdaji);

    /// Smije: svi (samo čitanje).
    /// SPEC: K13, K16
    function jeKupio(address kupac, uint256 idNota) external view returns (bool);

    /// Smije: svi (samo čitanje). Broj dodanih nota (zadnji dodijeljeni ID).
    /// SPEC: K10
    function brojNota() external view returns (uint256);
}
