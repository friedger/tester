import React, { useRef, useState, useEffect } from "react";
import { fetchAccount, getStacksAccount } from "lib/user/account";
import { useConnect } from "@stacks/connect-react";
import {
  accountsApi,
  CONTRACT_ADDRESS,
  smartContractsApi,
  NETWORK,
  GENUINE_CONTRACT_NAME,
  MARKET_CONTRACT_NAME
} from "lib/constants";

import {
  PostConditionMode,
  bufferCVFromString,
  stringAsciiCV,
  ClarityType,
  cvToString,
  deserializeCV,
  tupleCV,
  uintCV,
  bufferCV,
  listCV,
  standardPrincipalCV,
  contractPrincipalCV,
  serializeCV
} from "@stacks/transactions";

import { cvToHex, hexToCV } from "lib/user/transactions";

import {
  SUPPORTED_MEDIA_FORMATS,
  SUPPORTED_IMAGE_FORMATS,
  SUPPORTED_VIDEO_FORMATS,
  IMAGE_FILE_SIZE_LIMIT,
} from "lib/mediaSettings";

import { toBase64 } from "lib/fileHelper";

import sha256 from "crypto-js/sha256";

import { uploadFile, deleteFile } from "lib/user/media";

import { useStxAddresses } from "lib/user/hooks";
import { fetchGenuineIds } from "lib/user/genuine";
import { listFile, getFilefromStorage } from "lib/user/storage";

import NFT from "components/NFT";

import { address_name } from "lib/user/test";

import { userSession } from "lib/user/auth";

import {
  getPublicKeyFromPrivate,
  publicKeyToAddress,
} from "@stacks/encryption";

function MyNFT() {
  const { doContractCall, doOpenAuth } = useConnect();
  const { ownerStxAddress } = useStxAddresses();
  const [myNFT, setMyNFT] = useState([]);
  const [isFetchingNFTAssets, setIsFetchingNFTAssets] = useState(true);

  const [nftInfo, setNftInfo] = useState({
    name: null,
    previewFile: null,
    mainFile: null,
  });

  const [tempFile, setTempFile] = useState(null);

  useEffect(() => {
    if (ownerStxAddress) {
      setIsFetchingNFTAssets(true);
      fetchGenuineIds(ownerStxAddress)
        .then(async (assetIds) => {
          setMyNFT(assetIds);
          setIsFetchingNFTAssets(false);
        })
        .catch((e) => {
          setIsFetchingNFTAssets(false);
          console.log(e);
        });
    }
  }, [ownerStxAddress]);

  useEffect(() => {
    const userData = userSession.loadUserData();

    const publicKey1 = getPublicKeyFromPrivate(userData.appPrivateKey);
    console.log(publicKeyToAddress(publicKey1));

    //  publicKeyToAddress(26,publicKey.toString());

    // listFile().then(()=>{

    // })
    // getFilefromStorage("2b89c71c-5b9d-45f5-8511-24613a150750", {
    //   username: "18ksbyGwQhrTU67VaQMf32xBE5fDQ5hCfo",
    // }).then((res) => {
    //   console.log(res);
    // });

    // address_name("ST5TVJHR7RY9A1AGZPCKD5BVHNHC3HVJYNJVFZKK").then((res) => {
    //   console.log(res);
    // });

    // const address = publicKeyToAddress(26,publicKey.toString());
    // console.log(address)

    // const publicKey = getPublicKeyFromPrivate(userData.appPrivateKey);
    // console.log(publicKey)
    // // const { address, publicKey } = getStacksAccount(userData.appPrivateKey);
    // console.log(publicKeyToAddress(26, publicKey));
  }, []);

  useEffect(() => {}, [nftInfo]);

  const checkLicense = async () => {

  await doContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName:  MARKET_CONTRACT_NAME,
    functionName: 'test',
    functionArgs: [
      contractPrincipalCV('ST16KQ2VQSSJFGQJPNYC04P1SGVP77C760AJH38F2', GENUINE_CONTRACT_NAME),
      uintCV(1),
      uintCV(1),
      uintCV(1),
      standardPrincipalCV('ST39ZPD28F1TTDJWM2ZYGC86WHHBBVHTZ6G6N1XN5'),
    ],
    postConditionMode: PostConditionMode.Deny,
    postConditions: [],
    network: NETWORK,
    finished: data => {
      console.log(data);
    },
  });
}

  return (
    <div>
      <button
        onClick={(e) => {
          checkLicense();
        }}
      >
        check license
      </button>
    </div>
  );
}

export default MyNFT;
