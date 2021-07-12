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

  const testCall = async () => {
    doContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: GENUINE_CONTRACT_NAME,
      functionName: "attach-license",
      functionArgs: [
        uintCV(1),
        standardPrincipalCV("ST5TVJHR7RY9A1AGZPCKD5BVHNHC3HVJYNJVFZKK"),
        uintCV(1),
        uintCV(1),
      ],
      postConditionMode: PostConditionMode.Allow,
      postConditions: [],
      network: NETWORK,
      finished: (data) => {
        console.log(data);
        //   setTxId(data.txId);
        //   spinner.current.classList.add("d-none");
      },
      onCancel: (data) => {},
    });
  };

  const check = async () => {
    const test = tupleCV({
      "genuine-id": uintCV(1),
      owner: standardPrincipalCV(
        "ST5TVJHR7RY9A1AGZPCKD5BVHNHC3HVJYNJVFZKK",
      ),
    });
    const response = await smartContractsApi.getContractDataMapEntry({
      contractAddress: CONTRACT_ADDRESS,
      contractName: GENUINE_CONTRACT_NAME,
      mapName: "license",
      key: serializeCV(test).toString("hex"),
    });

    console.log(response)
    // smartContractsApi
    //   .callReadOnlyFunction({
    //     contractAddress: CONTRACT_ADDRESS,
    //     contractName: GENUINE_CONTRACT_NAME,
    //     functionName: "get-owner",
    //     readOnlyFunctionArgs: {
    //       sender: CONTRACT_ADDRESS,
    //       arguments: ["0x0100000000000000000000000000000002"],
    //     },
    //   })
    //   .then((response) => {
    //     console.log(response);
    //     console.log(
    //       cvToString(
    //         deserializeCV(Buffer.from(response.result.substr(2), "hex")).value
    //       )
    //     );
    //     // return cvToString(
    //     //   deserializeCV(Buffer.from(response.result.substr(2), "hex")).value
    //     // );
    //   });
  };


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

  const uploadNFT = async () => {
    let newNftInfo = Object.assign({}, nftInfo);
    const previewFile = newNftInfo.previewFile;
    const mainFile = newNftInfo.mainFile;
    const fileMimeType = mainFile.type;
    let prevHash = await toBase64(previewFile);
    let mainHash = await toBase64(mainFile);
    prevHash = sha256(prevHash);
    mainHash = sha256(mainHash);

    // console.log(mainHash)

    // console.log(bufferCV(Buffer.from(previewFileText)));

    // doContractCall({
    //   contractAddress: CONTRACT_ADDRESS,
    //   contractName: "sample-v2",
    //   functionName: "check-hash",
    //   functionArgs: [bufferCV(Buffer.from("9d20c6dd2881c64abf26ff30f"))],
    //   postConditionMode: PostConditionMode.Allow,
    //   postConditions: [],
    //   network: NETWORK,
    //   finished: (data) => {
    //     console.log(data);
    //     //   setTxId(data.txId);
    //     //   spinner.current.classList.add("d-none");
    //   },
    //   onCancel: (data) => {
    //     // return deleteFile(res.fileName);
    //   },
    // }).catch((err) => {
    //   console.log(err);
    // });

    // console.log(mainFile)
    // console.log(encrypted.toString());

    Promise.all([
      uploadFile(previewFile, { encrypt: false })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return { status: false };
        }),
      uploadFile(mainFile, { encrypt: true })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return { status: false };
        }),
    ])
      .then((res) => {
        const uploads = res.filter((item) => item.status === true);
        if (uploads.length !== 2) {
          Promise.all([
            uploads.map((val) => {
              return deleteFile(val.fileName);
            }),
          ]);
          throw new Error("Failed Upload");
        }

        if (uploads.length === 2) {
          console.log(uploads);
          return doContractCall({
            contractAddress: CONTRACT_ADDRESS,
            contractName: GENUINE_CONTRACT_NAME,
            functionName: "create-genuine",
            functionArgs: [
              stringAsciiCV("My Nft"),
              stringAsciiCV(fileMimeType),
              stringAsciiCV(res[0].uri),
              stringAsciiCV(res[0].fileName),
              stringAsciiCV(prevHash.toString()),
              stringAsciiCV(res[1].fileName),
              stringAsciiCV(mainHash.toString()),
            ],
            postConditionMode: PostConditionMode.Allow,
            postConditions: [],
            network: NETWORK,
            finished: (data) => {
              console.log(data);
              //   setTxId(data.txId);
              //   spinner.current.classList.add("d-none");
            },
            onCancel: (data) => {
              return Promise.all([
                deleteFile(res[0].fileName).then((res) => {
                  return true;
                }),
                deleteFile(res[1].fileName).then((res) => {
                  return true;
                }),
              ]);
            },
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // uploadFile(previewFile, { encrypt: false })
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .then((res) => {
    //     return doContractCall({
    //       contractAddress: CONTRACT_ADDRESS,
    //       contractName: GENUINE_CONTRACT_NAME,
    //       functionName: "create-genuine",
    //       functionArgs: [
    //         stringAsciiCV("My Nft"),
    //         stringAsciiCV(fileMimeType),
    //         stringAsciiCV(res.uri),
    //         stringAsciiCV(encrypted.toString()),
    //       ],
    //       postConditionMode: PostConditionMode.Allow,
    //       postConditions: [],
    //       network: NETWORK,
    //       finished: (data) => {
    //         console.log(data);
    //         //   setTxId(data.txId);
    //         //   spinner.current.classList.add("d-none");
    //       },
    //       onCancel: (data) => {
    //         return deleteFile(res.fileName);
    //       },
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    // console.log(await toBase64(test));
    // var data = await toBase64(test);
    // console.log(data);
    // var encrypted = sha256(data);
    // console.log(encrypted);
    //  var data = await toBase64(test);
    // var encrypted = sha256(data);
    // console.log("encrypted: " + encrypted);
  };

  const fetchData = async () => {
    let test = await fetch("my-file2");
    var encrypted = sha256(test);
    const b64 = new Buffer.from(test).toString("base64");
    const mimeType = "image/png";
  };

  const handleMediaInputChange = (e) => {
    e.preventDefault();

    let file = e.target.files;
    if (file.length === 1) {
      file = file[0];
      let reader = new FileReader();
      setNftInfo({ ...nftInfo, previewFile: file });
      reader.onload = (r) => {
        const tempUrl = window.URL.createObjectURL(file);
        setTempFile(tempUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMediaInputChange2 = (e) => {
    e.preventDefault();

    let file = e.target.files;
    if (file.length === 1) {
      file = file[0];
      let reader = new FileReader();
      setNftInfo({ ...nftInfo, mainFile: file });
      reader.onload = (r) => {};
      reader.readAsDataURL(file);
    }
  };
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          uploadNFT();
        }}
        className="form"
      >
        <div className="mt-8">
          {/* <div className="block">
            <label htmlFor="nft-name" className="block">
              Name
            </label>
            <input
              className="border outline-none inline-block"
              id="nft-name"
              onChange={(e) => {
                setNftInfo({ ...nftInfo, name: e.target.value });
              }}
            />
          </div> */}
          <div>
            <label htmlFor="nft-name" className="block">
              Preview File
            </label>
            <input
              accept="image/*"
              // style={{ display: "none" }}
              id="raised-button-file"
              type="file"
              onChange={async (e) => {
                await handleMediaInputChange(e);
              }}
              className="input-upload"
              // disabled={formLoading}
            />
          </div>

          <div>
            <label htmlFor="nft-name" className="block">
              Main File
            </label>
            <input
              accept="image/*"
              // style={{ display: "none" }}
              id="raised-button-file"
              type="file"
              onChange={async (e) => {
                await handleMediaInputChange2(e);
              }}
              className="input-upload"
              // disabled={formLoading}
            />
          </div>
        </div>
        <button type="submit">submit</button>
      </form>

      <button
        onClick={(e) => {
          testCall();
        }}
      >
        add
      </button>
      <button
        onClick={(e) => {
          check();
        }}
      >
        check
      </button>
      <button
        onClick={(e) => {
          checkLicense();
        }}
      >
        check license
      </button>
      {/* {fetchedFile && fetchedFile.length !== 0 && (
        <img
          alt="test"
          src={`data:${fetchedFile[0].mime};base64,${fetchedFile[0].file}`}
        />
      )} */}
      {/* <button
        onClick={(e) => {
          e.preventDefault();
          sendAction();
        }}
      >
        Create NFT
      </button> */}
      {isFetchingNFTAssets ? (
        <>Loading</>
      ) : myNFT.length === 0 ? (
        <>No NFT Avaialable</>
      ) : (
        myNFT.map((val, i) => {
          const assetId = deserializeCV(Buffer.from(val.substr(2), "hex"));
          return (
            <NFT
              key={i}
              assetId={assetId.value}
              ownerStxAddress={ownerStxAddress}
            />
          );
        })
      )}
    </div>
  );
}

export default MyNFT;
