import {
  uintCV,
  bufferCVFromString,
  bufferCV,
  someCV,
  callReadOnlyFunction,
  makeStandardSTXPostCondition,
  makeStandardNonFungiblePostCondition,
  FungibleConditionCode,
  NonFungibleConditionCode,
  createAssetInfo,
  PostConditionMode,
  cvToJSON,
  hash160,
  standardPrincipalCV,
  tupleCV,
} from "@stacks/transactions";

import { StacksMainnet, StacksTestnet, StacksMocknet } from "@stacks/network";
import BN from "bn.js";

import { userSession } from "./auth";

import { NETWORK } from "./constants";

export let BNS_CONTRACT_ADDRESS = "ST000000000000000000002AMW42H";
export const BNS_CONTRACT_NAME = "bns";

async function contract_read(func, args) {
  // cvToValue() not exported?
  return cvToJSON(
    await callReadOnlyFunction({
      userSession: userSession,
      contractAddress: BNS_CONTRACT_ADDRESS,
      contractName: BNS_CONTRACT_NAME,
      functionName: func,
      functionArgs: args,
      validateWithAbi: true,
      network: NETWORK,
      senderAddress: BNS_CONTRACT_ADDRESS,
    })
  ).value.value;
}

export async function address_name(address) {
  let result = await contract_read("resolve-principal", [
    standardPrincipalCV(address),
  ]);

  console.log(result)
  if (!result || !result.name || !result.name.value) return false;
  return (
    Buffer.from(result.name.value.substr(2), "hex").toString("ascii") +
    "." +
    Buffer.from(result.namespace.value.substr(2), "hex").toString("ascii")
  );
}
