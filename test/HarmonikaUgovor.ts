import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("HarmonikaUgovor", function () {
  let ugovor: any;
  let vlasnik: any, admin: any, polaznik: any, drugi: any, x: any;

  beforeEach(async function () {
    [vlasnik, admin, polaznik, drugi, x] = await ethers.getSigners();
    ugovor = await ethers.deployContract("HarmonikaUgovor");
    await ugovor.connect(vlasnik).dodajAdministratora(admin.address);
  });

  // ─────────────────────────── ERC-20 čitanje ───────────────────────────

  describe("name, symbol, decimals", function () {
    it("K19: vraća Harmonika bodovi, HBOD i 0", async function () {
      expect(await ugovor.name()).to.equal("Harmonika bodovi");
      expect(await ugovor.symbol()).to.equal("HBOD");
      expect(await ugovor.decimals()).to.equal(0n);
    });
  });

  // ───────────────────────────── dodijeliBodove ─────────────────────────────

  describe("dodijeliBodove", function () {
    it("K1: administrator dodijeli 10 bodova, emitira BodoviDodijeljeni", async function () {
      expect(await ugovor.balanceOf(polaznik.address)).to.equal(0n);
      await expect(ugovor.connect(admin).dodijeliBodove(polaznik.address, 10))
        .to.emit(ugovor, "BodoviDodijeljeni")
        .withArgs(admin.address, polaznik.address, 10);
      expect(await ugovor.balanceOf(polaznik.address)).to.equal(10n);
      expect(await ugovor.totalSupply()).to.equal(10n);
    });

    it("K17: dodjela emitira Transfer(0x0, polaznik, 3)", async function () {
      await expect(ugovor.connect(admin).dodijeliBodove(polaznik.address, 3))
        .to.emit(ugovor, "Transfer")
        .withArgs(ethers.ZeroAddress, polaznik.address, 3);
    });

    it("K2: pada s 'Samo administrator' ako pozivatelj nije administrator", async function () {
      await expect(
        ugovor.connect(drugi).dodijeliBodove(polaznik.address, 5),
      ).to.be.revertedWith("Samo administrator");
    });

    it("vlasnik koji nije administrator ne smije dodijeliti bodove", async function () {
      await expect(
        ugovor.connect(vlasnik).dodijeliBodove(polaznik.address, 5),
      ).to.be.revertedWith("Samo administrator");
    });

    it("K3: pada s 'Iznos mora biti od 1 do 10' za 11 bodova", async function () {
      await expect(
        ugovor.connect(admin).dodijeliBodove(polaznik.address, 11),
      ).to.be.revertedWith("Iznos mora biti od 1 do 10");
    });

    it("pada s 'Iznos mora biti od 1 do 10' za 0 bodova", async function () {
      await expect(
        ugovor.connect(admin).dodijeliBodove(polaznik.address, 0),
      ).to.be.revertedWith("Iznos mora biti od 1 do 10");
    });

    it("K4: pada s 'Administrator ne moze sebi dodijeliti bodove'", async function () {
      await expect(
        ugovor.connect(admin).dodijeliBodove(admin.address, 5),
      ).to.be.revertedWith("Administrator ne moze sebi dodijeliti bodove");
    });

    it("provjera 'sebi' dolazi prije provjere iznosa", async function () {
      await expect(
        ugovor.connect(admin).dodijeliBodove(admin.address, 11),
      ).to.be.revertedWith("Administrator ne moze sebi dodijeliti bodove");
    });

    it("pada s 'Neispravna adresa' za nultu adresu", async function () {
      await expect(
        ugovor.connect(admin).dodijeliBodove(ethers.ZeroAddress, 5),
      ).to.be.revertedWith("Neispravna adresa");
    });
  });

  // ────────────────────────────── oduzmiBodove ──────────────────────────────

  describe("oduzmiBodove", function () {
    beforeEach(async function () {
      await ugovor.connect(admin).dodijeliBodove(polaznik.address, 10);
    });

    it("K6: oduzme 4 boda, saldo 6, ukupna količina manja za 4", async function () {
      const prije = await ugovor.totalSupply();
      await expect(ugovor.connect(admin).oduzmiBodove(polaznik.address, 4))
        .to.emit(ugovor, "BodoviOduzeti")
        .withArgs(admin.address, polaznik.address, 4);
      expect(await ugovor.balanceOf(polaznik.address)).to.equal(6n);
      expect(await ugovor.totalSupply()).to.equal(prije - 4n);
    });

    it("oduzimanje emitira Transfer(polaznik, 0x0, iznos)", async function () {
      await expect(ugovor.connect(admin).oduzmiBodove(polaznik.address, 4))
        .to.emit(ugovor, "Transfer")
        .withArgs(polaznik.address, ethers.ZeroAddress, 4);
    });

    it("K7: polaznik ima 3 boda, oduzimanje 5 pada s 'Nedovoljno bodova'", async function () {
      await ugovor.connect(admin).dodijeliBodove(drugi.address, 3);
      await expect(
        ugovor.connect(admin).oduzmiBodove(drugi.address, 5),
      ).to.be.revertedWith("Nedovoljno bodova");
      expect(await ugovor.balanceOf(drugi.address)).to.equal(3n);
    });

    it("pada s 'Iznos mora biti veci od 0' za iznos 0", async function () {
      await expect(
        ugovor.connect(admin).oduzmiBodove(polaznik.address, 0),
      ).to.be.revertedWith("Iznos mora biti veci od 0");
    });

    it("pada s 'Samo administrator' ako pozivatelj nije administrator", async function () {
      await expect(
        ugovor.connect(drugi).oduzmiBodove(polaznik.address, 1),
      ).to.be.revertedWith("Samo administrator");
    });
  });

  // ───────────────────────── transfer / transferFrom / approve ─────────────────────────

  describe("prenosivost", function () {
    beforeEach(async function () {
      await ugovor.connect(admin).dodijeliBodove(polaznik.address, 10);
    });

    it("K5: transfer pada s 'Bodovi nisu prenosivi'", async function () {
      await expect(
        ugovor.connect(polaznik).transfer(drugi.address, 5),
      ).to.be.revertedWith("Bodovi nisu prenosivi");
      expect(await ugovor.balanceOf(polaznik.address)).to.equal(10n);
    });

    it("K5: transferFrom pada s 'Bodovi nisu prenosivi'", async function () {
      await expect(
        ugovor.connect(drugi).transferFrom(polaznik.address, drugi.address, 5),
      ).to.be.revertedWith("Bodovi nisu prenosivi");
      expect(await ugovor.balanceOf(polaznik.address)).to.equal(10n);
    });

    it("K20: approve pada s 'Bodovi nisu prenosivi', allowance ostaje 0", async function () {
      await expect(
        ugovor.connect(polaznik).approve(drugi.address, 5),
      ).to.be.revertedWith("Bodovi nisu prenosivi");
      expect(await ugovor.allowance(polaznik.address, drugi.address)).to.equal(0n);
    });
  });

  // ──────────────────────────── administratori ────────────────────────────

  describe("dodajAdministratora", function () {
    it("K8: vlasnik doda A, A dodijeli 5 bodova P", async function () {
      await expect(ugovor.connect(vlasnik).dodajAdministratora(x.address))
        .to.emit(ugovor, "AdministratorDodan")
        .withArgs(x.address);
      expect(await ugovor.jeAdministrator(x.address)).to.equal(true);

      const prije = await ugovor.balanceOf(polaznik.address);
      await ugovor.connect(x).dodijeliBodove(polaznik.address, 5);
      expect(await ugovor.balanceOf(polaznik.address)).to.equal(prije + 5n);
    });

    it("K9a: administrator ne smije dodati administratora ('Samo vlasnik')", async function () {
      await expect(
        ugovor.connect(admin).dodajAdministratora(x.address),
      ).to.be.revertedWith("Samo vlasnik");
      expect(await ugovor.jeAdministrator(x.address)).to.equal(false);
    });

    it("K18: dodavanje nulte adrese pada s 'Neispravna adresa'", async function () {
      await expect(
        ugovor.connect(vlasnik).dodajAdministratora(ethers.ZeroAddress),
      ).to.be.revertedWith("Neispravna adresa");
    });

    it("pada s 'Vec je administrator' ako je adresa već administrator", async function () {
      await expect(
        ugovor.connect(vlasnik).dodajAdministratora(admin.address),
      ).to.be.revertedWith("Vec je administrator");
    });
  });

  describe("ukloniAdministratora", function () {
    it("vlasnik uklanja administratora, emitira AdministratorUklonjen", async function () {
      await expect(ugovor.connect(vlasnik).ukloniAdministratora(admin.address))
        .to.emit(ugovor, "AdministratorUklonjen")
        .withArgs(admin.address);
      expect(await ugovor.jeAdministrator(admin.address)).to.equal(false);
      await expect(
        ugovor.connect(admin).dodijeliBodove(polaznik.address, 1),
      ).to.be.revertedWith("Samo administrator");
    });

    it("K9b: administrator ne smije ukloniti vlasnika-administratora", async function () {
      await ugovor.connect(vlasnik).dodajAdministratora(vlasnik.address);
      await expect(
        ugovor.connect(admin).ukloniAdministratora(vlasnik.address),
      ).to.be.revertedWith("Samo vlasnik");
      expect(await ugovor.jeAdministrator(vlasnik.address)).to.equal(true);
    });

    it("pada s 'Neispravna adresa' za nultu adresu", async function () {
      await expect(
        ugovor.connect(vlasnik).ukloniAdministratora(ethers.ZeroAddress),
      ).to.be.revertedWith("Neispravna adresa");
    });

    it("pada s 'Nije administrator' ako adresa nije administrator", async function () {
      await expect(
        ugovor.connect(vlasnik).ukloniAdministratora(x.address),
      ).to.be.revertedWith("Nije administrator");
    });
  });

  // ────────────────────────────── vlasništvo ──────────────────────────────

  describe("prenesiVlasnistvo", function () {
    it("početni vlasnik je adresa koja je objavila ugovor", async function () {
      expect(await ugovor.vlasnik()).to.equal(vlasnik.address);
    });

    it("K15: V prenese na W; V više ne smije, W smije dodati administratora", async function () {
      const w = drugi;
      await expect(ugovor.connect(vlasnik).prenesiVlasnistvo(w.address))
        .to.emit(ugovor, "VlasnistvoPreneseno")
        .withArgs(vlasnik.address, w.address);
      expect(await ugovor.vlasnik()).to.equal(w.address);

      await expect(
        ugovor.connect(vlasnik).dodajAdministratora(x.address),
      ).to.be.revertedWith("Samo vlasnik");

      await ugovor.connect(w).dodajAdministratora(x.address);
      expect(await ugovor.jeAdministrator(x.address)).to.equal(true);
    });

    it("prijenos vlasništva ne mijenja administratorske uloge", async function () {
      await ugovor.connect(vlasnik).prenesiVlasnistvo(drugi.address);
      expect(await ugovor.jeAdministrator(admin.address)).to.equal(true);
      expect(await ugovor.jeAdministrator(drugi.address)).to.equal(false);
    });

    it("pada s 'Samo vlasnik' ako pozivatelj nije vlasnik", async function () {
      await expect(
        ugovor.connect(admin).prenesiVlasnistvo(admin.address),
      ).to.be.revertedWith("Samo vlasnik");
    });

    it("pada s 'Neispravna adresa' za nultu adresu", async function () {
      await expect(
        ugovor.connect(vlasnik).prenesiVlasnistvo(ethers.ZeroAddress),
      ).to.be.revertedWith("Neispravna adresa");
    });
  });

  describe("transferOwnership / renounceOwnership (Ownable)", function () {
    it("K22: transferOwnership pada s 'Koristi prenesiVlasnistvo', vlasnik ostaje isti", async function () {
      await expect(
        ugovor.connect(vlasnik).transferOwnership(drugi.address),
      ).to.be.revertedWith("Koristi prenesiVlasnistvo");
      expect(await ugovor.vlasnik()).to.equal(vlasnik.address);
    });

    it("K22: renounceOwnership pada s 'Koristi prenesiVlasnistvo', vlasnik ostaje isti", async function () {
      await expect(
        ugovor.connect(vlasnik).renounceOwnership(),
      ).to.be.revertedWith("Koristi prenesiVlasnistvo");
      expect(await ugovor.vlasnik()).to.equal(vlasnik.address);
    });
  });
});
