
import { ethers } from "hardhat";
const hre = require("hardhat");

async function main() {

  const factoryAddr = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const SYEtokenAddr = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const walletFactory = await ethers.getContractAt("MultiSignatureFactory", factoryAddr);
  const [owner, addr1, addr2, addr3, addr4, addr5] = await hre.ethers.getSigners();
  const signers = [addr1.address, addr2.address, addr3.address, addr4.address, addr5.address];
  // console.log(signers);


  // console.log(signers);

  //Create MultiSignature Wallet
  const createWallet = await walletFactory.createMultisigWallet(3, signers);
  const wallet = await createWallet.wait();
  // console.log("Create MultiSig Clones:", wallet)
  const walletClone = await walletFactory.getMultiSigClones();
  console.log("New Wallet clone addresses: ", walletClone);

  const walletClone1 = walletClone[0];
  const sigWallet = await ethers.getContractAt("MultiSignature", walletClone1);

  const syeToken = await ethers.getContractAt("SYE", SYEtokenAddr);
  const amountToTransfer_ = ethers.parseUnits("5", 18);
  const trToken = await syeToken.transfer(walletClone1, amountToTransfer_);
  trToken.wait();
  console.log("Transfer some GTK ERC Token to wallet");
  const cloneBal = await syeToken.balanceOf(walletClone1);
  console.log(`Clone One ${walletClone1} SYE Contract Balance:  ${cloneBal}` )

  //Interact with transfer function.
  const amountToTransfer = ethers.parseUnits("1", 18);
  const trf = await sigWallet.connect(addr1).transfer(amountToTransfer, "0x06D97198756295A96C2158a23963306f507b2f69", SYEtokenAddr);
  console.log("Transfer from multisig wallet initiated with block hash", trf.hash);

  //Interact with the approveTx in multi-signature wallet



}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
