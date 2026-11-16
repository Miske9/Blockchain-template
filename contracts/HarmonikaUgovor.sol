// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IHarmonikaToken} from "./IHarmonika.sol";

/// @title Harmonika bodovi (HBOD)
/// @notice Neprenosivi bodovi za polaznike tečaja harmonike. 0 decimala.
/// @dev Izvor: docs/SPEC.md. Redoslijed provjera: ovlast → adresa → iznos → stanje.
contract HarmonikaUgovor is ERC20, Ownable, IHarmonikaToken {
    mapping(address => bool) private _administratori;

    // K15, K19 (objavitelj postaje vlasnik; naziv i oznaka tokena)
    constructor() ERC20("Harmonika bodovi", "HBOD") Ownable(msg.sender) {}

    // ─────────────────────────────── Modifikatori ───────────────────────────────

    // K9a, K9b, K15
    modifier samoVlasnik() {
        require(msg.sender == owner(), "Samo vlasnik");
        _;
    }

    // K2
    modifier samoAdministrator() {
        require(_administratori[msg.sender], "Samo administrator");
        _;
    }

    // ───────────────────────── ERC-20: samo čitanje ─────────────────────────

    // K19
    function name() public view override(ERC20, IHarmonikaToken) returns (string memory) {
        return super.name();
    }

    // K19
    function symbol() public view override(ERC20, IHarmonikaToken) returns (string memory) {
        return super.symbol();
    }

    // K19
    function decimals() public pure override(ERC20, IHarmonikaToken) returns (uint8) {
        return 0;
    }

    // K6, K11
    function totalSupply() public view override(ERC20, IHarmonikaToken) returns (uint256) {
        return super.totalSupply();
    }

    // K1, K6, K7, K8, K11, K12, K16
    function balanceOf(address racun) public view override(ERC20, IHarmonikaToken) returns (uint256) {
        return super.balanceOf(racun);
    }

    // K20
    function allowance(address, address) public pure override(ERC20, IHarmonikaToken) returns (uint256) {
        return 0;
    }

    // ───────────────────── ERC-20: prijenos (uvijek pada) ─────────────────────

    // K5
    function transfer(address, uint256) public pure override(ERC20, IHarmonikaToken) returns (bool) {
        revert("Bodovi nisu prenosivi");
    }

    // K5
    function transferFrom(address, address, uint256) public pure override(ERC20, IHarmonikaToken) returns (bool) {
        revert("Bodovi nisu prenosivi");
    }

    // K20
    function approve(address, uint256) public pure override(ERC20, IHarmonikaToken) returns (bool) {
        revert("Bodovi nisu prenosivi");
    }

    // ──────────────────────────────── Bodovi ────────────────────────────────

    // K1, K2, K3, K4, K8, K17
    function dodijeliBodove(address polaznik, uint256 iznos) external samoAdministrator {
        require(polaznik != address(0), "Neispravna adresa");
        require(polaznik != msg.sender, "Administrator ne moze sebi dodijeliti bodove");
        require(iznos >= 1 && iznos <= 10, "Iznos mora biti od 1 do 10");

        _mint(polaznik, iznos); // emitira Transfer(0x0, polaznik, iznos)
        emit BodoviDodijeljeni(msg.sender, polaznik, iznos);
    }

    // K6, K7
    function oduzmiBodove(address polaznik, uint256 iznos) external samoAdministrator {
        require(iznos > 0, "Iznos mora biti veci od 0");
        require(iznos <= balanceOf(polaznik), "Nedovoljno bodova");

        _burn(polaznik, iznos); // emitira Transfer(polaznik, 0x0, iznos)
        emit BodoviOduzeti(msg.sender, polaznik, iznos);
    }

    // ──────────────────────────── Uloge i vlasništvo ────────────────────────────

    // K8, K9a, K15, K18
    function dodajAdministratora(address adresa) external samoVlasnik {
        require(adresa != address(0), "Neispravna adresa");
        require(!_administratori[adresa], "Vec je administrator");

        _administratori[adresa] = true;
        emit AdministratorDodan(adresa);
    }

    // K9b
    function ukloniAdministratora(address adresa) external samoVlasnik {
        require(adresa != address(0), "Neispravna adresa");
        require(_administratori[adresa], "Nije administrator");

        _administratori[adresa] = false;
        emit AdministratorUklonjen(adresa);
    }

    // K15
    function prenesiVlasnistvo(address novaAdresa) external samoVlasnik {
        require(novaAdresa != address(0), "Neispravna adresa");

        address stari = owner();
        _transferOwnership(novaAdresa); // administratorske uloge ostaju nepromijenjene
        emit VlasnistvoPreneseno(stari, novaAdresa);
    }

    // K22 (naslijeđeno iz Ownable; onemogućeno da se vlasništvo mijenja samo kroz prenesiVlasnistvo)
    function transferOwnership(address) public pure override {
        revert("Koristi prenesiVlasnistvo");
    }

    // K22 (naslijeđeno iz Ownable; onemogućeno da ugovor ne ostane bez vlasnika)
    function renounceOwnership() public pure override {
        revert("Koristi prenesiVlasnistvo");
    }

    // K15
    function vlasnik() external view returns (address) {
        return owner();
    }

    // K8, K9b, K15
    function jeAdministrator(address adresa) external view returns (bool) {
        return _administratori[adresa];
    }
}
