import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SayaeModule = buildModule("SYEModule", (m) => {

  const syeToken = m.contract("SYE");

  return { syeToken };
});

export default SayaeModule;