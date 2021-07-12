import {
  ClarityType,
  cvToString,
  deserializeCV,
  tupleCV,
  uintCV,
} from "@stacks/transactions";

import {
  accountsApi,
  CONTRACT_ADDRESS,
  GENUINE_CONTRACT_NAME,
  smartContractsApi,
} from "./constants";
import { cvToHex, hexToCV } from "./transactions";
export async function fetchGenuineIds(ownerStxAddress) {
  console.log(ownerStxAddress);
  return accountsApi
    .getAccountAssets({ principal: ownerStxAddress })
    .then((assetList) => {
      console.log({ assetList });
      return assetList;
    })
    .then((assetList) =>
      assetList.results
        .filter(
          (a) =>
            a.event_type === "non_fungible_token_asset" &&
            a.asset.asset_id === `${CONTRACT_ADDRESS}.genuine-v1::nft-genuine`
        )
        .map((a) => a.asset.value.hex)
    )
    .then((idsHex) => [...new Set(idsHex)]);
}

export function fetchGenuineDetails(assetId) {
  return Promise.all([
    smartContractsApi
      .callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: GENUINE_CONTRACT_NAME,
        functionName: "get-owner",
        readOnlyFunctionArgs: {
          sender: CONTRACT_ADDRESS,
          arguments: [cvToHex(uintCV(assetId))],
        },
      })
      .then((response) => {
        console.log(response);
        console.log(
          cvToString(
            deserializeCV(Buffer.from(response.result.substr(2), "hex")).value
          )
        );
        return cvToString(
          deserializeCV(Buffer.from(response.result.substr(2), "hex")).value
        );
      }),

    smartContractsApi
      .getContractDataMapEntry({
        contractAddress: CONTRACT_ADDRESS,
        contractName: GENUINE_CONTRACT_NAME,
        mapName: "genuine",
        key: cvToHex(tupleCV({ "genuine-id": uintCV(assetId) })),
      })
      .then((dataMap) => {
        const metaData = deserializeCV(
          Buffer.from(dataMap.data.substr(2), "hex")
        ).value.data;
        // console.log({metaData})
        return {
          mimeType: metaData["mime-type"].data,
          name: metaData["name"].data,
          prevFileName: metaData["preview-file-filename"].data,
          prevHash: metaData["preview-file-hash"].data,
          prevUri: metaData["preview-file-uri"].data,
          mainFileName: metaData["main-file-filename"].data,
          mainHash: metaData["main-file-hash"].data,
        };
      }),
    // smartContractsApi
    //   .callReadOnlyFunction({
    //     contractAddress: CONTRACT_ADDRESS,
    //     contractName: GENUINE_CONTRACT_NAME,
    //     functionName: 'is-alive',
    //     readOnlyFunctionArgs: {
    //       sender: CONTRACT_ADDRESS,
    //       arguments: [cvToHex(uintCV(assetId))],
    //     },
    //   })
    //   .then(response => {
    //     const responseCV = hexToCV(response.result);
    //     return responseCV.type === ClarityType.ResponseOk
    //       ? responseCV.value.type === ClarityType.BoolTrue
    //       : false;
    //   }),
  ]).then((result) => {
    console.log(result);
    return { owner: result[0], metaData: result[1] };
  });
}
