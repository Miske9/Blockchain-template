import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("HarmonikaUgovor (token)", function () {
  let ugovor;
  let vlasnik, admin, polaznik, drugi, x;

  // Svaki test dobiva svjez ugovor: vlasnik je objavitelj, "admin" je administrator.
  beforeEach(async function () {
    [vlasnik, admin, polaznik, drugi, x] = await ethers.getSigners();
    ugovor = await ethers.deployContract("HarmonikaUgovor");
    await ugovor.connect(vlasnik).dodajAdministratora(admin.address);
  });

  // ─────────────────────────── Polaznik ima 0 bodova ───────────────────────────

  describe("polaznik ima 0 bodova", function () {
    it("K1: administrator dodijeli 10 bodova, polaznik ima 10 i emitiran je BodoviDodijeljeni", async function () {
      expect(await ugovor.balanceOf(polaznik.address)).to.equal(0n);

      await expect(ugovor.connect(admin).dodijeliBodove(polaznik.address, 10))
        .to.emit(ugovor, "BodoviDodijeljeni")
        .withArgs(admin.address, polaznik.address, 10n);

      expect(await ugovor.balanceOf(polaznik.address)).to.equal(10n);
    });

    it("K2: adresa koja nije administrator ne moze dodijeliti 5 bodova", async function () {
      expect(await ugovor.jeAdministrator(drugi.address)).to.equal(false);

      await expect(
        ugovor.connect(drugi).dodijeliBodove(polaznik.address, 5)
      ).to.be.revertedWith("Samo administrator");
    });

    it("K3: administrator ne moze dodijeliti 11 bodova", async function () {
      await expect(
        ugovor.connect(admin).dodijeliBodove(polaznik.address, 11)
      ).to.be.revertedWith("Iznos mora biti od 1 do 10");

      expect(await ugovor.balanceOf(polaznik.address)).to.equal(0n);
    });

    it("K4: administrator ne moze sebi dodijeliti 5 bodova", async function () {
      await expect(
        ugovor.connect(admin).dodijeliBodove(admin.address, 5)
      ).to.be.revertedWith("Administrator ne moze sebi dodijeliti bodove");
    });

    it("K17: dodjela 3 boda emitira Transfer(0x0, polaznik, 3)", async function () {
      await expect(ugovor.connect(admin).dodijeliBodove(polaznik.address, 3))
        .to.emit(ugovor, "Transfer")
        .withArgs(ethers.ZeroAddress, polaznik.address, 3n);

      // Drugi dio K17 ("kada polaznik kupi note od 3 boda, emitiran je
      // Transfer(polaznik, 0x0, 3)") NIJE MOGUCE TESTIRATI: ugovor
      // HarmonikaUgovor nema funkcije kupiNote ni dodajNote (modul trgovine
      // postoji samo kao sucelje IHarmonikaBodoviModul).
    });
  });

  // ─────────────────────────── Polaznik ima 10 bodova ───────────────────────────

  describe("polaznik ima 10 bodova", function () {
    beforeEach(async function () {
      await ugovor.connect(admin).dodijeliBodove(polaznik.address, 10);
    });

    it("K5: transfer i transferFrom padaju s 'Bodovi nisu prenosivi'", async function () {
      await expect(
        ugovor.connect(polaznik).transfer(drugi.address, 5)
      ).to.be.revertedWith("Bodovi nisu prenosivi");

      await expect(
        ugovor.connect(polaznik).transferFrom(polaznik.address, drugi.address, 5)
      ).to.be.revertedWith("Bodovi nisu prenosivi");

      expect(await ugovor.balanceOf(polaznik.address)).to.equal(10n);
      expect(await ugovor.balanceOf(drugi.address)).to.equal(0n);
    });

    it("K6: administrator oduzme 4 boda, polaznik ima 6, ukupna kolicina manja za 4", async function () {
      const ukupnoPrije = await ugovor.totalSupply();

      await ugovor.connect(admin).oduzmiBodove(polaznik.address, 4);

      expect(await ugovor.balanceOf(polaznik.address)).to.equal(6n);
      expect(await ugovor.totalSupply()).to.equal(ukupnoPrije - 4n);
    });

    it("K20: approve pada s 'Bodovi nisu prenosivi' i allowance vraca 0", async function () {
      await expect(
        ugovor.connect(polaznik).approve(drugi.address, 5)
      ).to.be.revertedWith("Bodovi nisu prenosivi");

      expect(await ugovor.allowance(polaznik.address, drugi.address)).to.equal(0n);
    });
  });

  // ─────────────────────────── Polaznik ima 3 boda ───────────────────────────

  describe("polaznik ima 3 boda", function () {
    beforeEach(async function () {
      await ugovor.connect(admin).dodijeliBodove(polaznik.address, 3);
    });

    it("K7: administrator ne moze oduzeti 5 bodova", async function () {
      await expect(
        ugovor.connect(admin).oduzmiBodove(polaznik.address, 5)
      ).to.be.revertedWith("Nedovoljno bodova");

      expect(await ugovor.balanceOf(polaznik.address)).to.equal(3n);
    });
  });

  // ─────────────────────────── Uloge i vlasnistvo ───────────────────────────

  describe("uloge i vlasnistvo", function () {
    it("K8: vlasnik doda A za administratora, A dodijeli P 5 bodova", async function () {
      expect(await ugovor.jeAdministrator(x.address)).to.equal(false);
      const saldoPrije = await ugovor.balanceOf(polaznik.address);

      await expect(ugovor.connect(vlasnik).dodajAdministratora(x.address))
        .to.emit(ugovor, "AdministratorDodan")
        .withArgs(x.address);

      await ugovor.connect(x).dodijeliBodove(polaznik.address, 5);

      expect(await ugovor.balanceOf(polaznik.address)).to.equal(saldoPrije + 5n);
    });

    it("K9a: administrator ne moze pozvati dodajAdministratora", async function () {
      expect(await ugovor.jeAdministrator(x.address)).to.equal(false);

      await expect(
        ugovor.connect(admin).dodajAdministratora(x.address)
      ).to.be.revertedWith("Samo vlasnik");

      expect(await ugovor.jeAdministrator(x.address)).to.equal(false);
    });

    describe("vlasnik je sebe dodao kao administratora", function () {
      beforeEach(async function () {
        await ugovor.connect(vlasnik).dodajAdministratora(vlasnik.address);
      });

      it("K9b: administrator ne moze ukloniti vlasnika iz administratora", async function () {
        await expect(
          ugovor.connect(admin).ukloniAdministratora(vlasnik.address)
        ).to.be.revertedWith("Samo vlasnik");

        expect(await ugovor.jeAdministrator(vlasnik.address)).to.equal(true);
      });
    });

    it("K15: prijenos vlasnistva na W; stari vlasnik gubi ovlast, W dodaje administratora", async function () {
      await expect(ugovor.connect(vlasnik).prenesiVlasnistvo(drugi.address))
        .to.emit(ugovor, "VlasnistvoPreneseno")
        .withArgs(vlasnik.address, drugi.address);

      expect(await ugovor.vlasnik()).to.equal(drugi.address);

      await expect(
        ugovor.connect(vlasnik).dodajAdministratora(x.address)
      ).to.be.revertedWith("Samo vlasnik");

      await ugovor.connect(drugi).dodajAdministratora(x.address);
      expect(await ugovor.jeAdministrator(x.address)).to.equal(true);
    });

    it("K18: vlasnik ne moze dodati nultu adresu za administratora", async function () {
      await expect(
        ugovor.connect(vlasnik).dodajAdministratora(ethers.ZeroAddress)
      ).to.be.revertedWith("Neispravna adresa");
    });

    it("K22: transferOwnership i renounceOwnership padaju, vlasnik ostaje V", async function () {
      await expect(
        ugovor.connect(vlasnik).transferOwnership(drugi.address)
      ).to.be.revertedWith("Koristi prenesiVlasnistvo");

      await expect(
        ugovor.connect(vlasnik).renounceOwnership()
      ).to.be.revertedWith("Koristi prenesiVlasnistvo");

      expect(await ugovor.vlasnik()).to.equal(vlasnik.address);
    });
  });

  // ─────────────────────────── ERC-20 citanje ───────────────────────────

  describe("name, symbol, decimals", function () {
    it("K19: vracaju 'Harmonika bodovi', 'HBOD' i 0", async function () {
      expect(await ugovor.name()).to.equal("Harmonika bodovi");
      expect(await ugovor.symbol()).to.equal("HBOD");
      expect(await ugovor.decimals()).to.equal(0n);
    });
  });

  // ─────────────────────────── Kriteriji koje nije moguce testirati ───────────────────────────
  //
  // Sljedeci kriteriji odnose se na modul "Nagradna trgovina" (IHarmonikaBodoviModul).
  // Ugovor HarmonikaUgovor taj modul NE implementira: nema funkcija dodajNote,
  // promijeniCijenu, povuciNote, kupiNote, dohvatiNote, jeKupio ni brojNota.
  // Zato ih nije moguce testirati bez izmjene ugovora:
  //
  // K10: administrator doda note "Oj Dunave" s cijenom 15; note postoje, u prodaji su,
  //      emitiran NoteDodane.
  // K11: polaznik s 20 bodova kupi note od 15; ima 5 bodova, ukupna kolicina manja za 15,
  //      emitiran NoteKupljene(kupac, id, cijena).
  // K12: polaznik s 10 bodova pokusa kupiti note od 15 -> "Nedovoljno bodova".
  // K13: polaznik ponovno kupuje vec kupljene note -> "Note su vec kupljene".
  // K14: polaznik kupuje povucene note -> "Note nisu u prodaji".
  // K16: adresa sa saldom 0 kupuje note od 1 -> "Nedovoljno bodova", jeKupio ostaje false.
  // K21: administrator promijeni cijenu s 15 na 10; dohvatiNote vraca 10,
  //      emitiran CijenaPromijenjena(id, 15, 10).
  // K17 (drugi dio): kupnja nota od 3 boda emitira Transfer(polaznik, 0x0, 3).
});
