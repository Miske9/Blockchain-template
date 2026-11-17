import { network } from "hardhat";

const { ethers } = await network.connect();
const [vlasnik] = await ethers.getSigners();

// HarmonikaUgovor nema parametara u konstruktoru (naziv, oznaka i vlasnik su fiksni).
const token = await ethers.deployContract("HarmonikaUgovor");
await token.waitForDeployment();

// Vlasnik smije dodjeljivati bodove i upravljati notama samo ako sam sebe doda kao administratora.
await (await token.dodajAdministratora(vlasnik.address)).wait();

console.log("Token objavljen na adresi:", await token.getAddress());
console.log("Administrator:", vlasnik.address);
