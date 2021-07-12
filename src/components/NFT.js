import React, { useEffect, useState } from "react";
import { useConnect } from "@stacks/connect-react";
import { PostConditionMode, uintCV } from "@stacks/transactions";
import { fetchGenuineDetails } from "lib/user/genuine";
import { getFilefromStorage } from "lib/user/storage";

function NFT(props) {
  const { assetId, ownerStxAddress } = props;
  const { doContractCall } = useConnect();
  const [nftDetails, setNftDetails] = useState([]);
  const [mainFile, setMainFile] = useState();
  const [isFetchingInfo, setIsFetchingInfo] = useState(true);

  useEffect(() => {
    if (assetId) {
      setIsFetchingInfo(true);
      fetchGenuineDetails(assetId)
        .then((details) => {
          setNftDetails([details]);
          setIsFetchingInfo(false);
        })
        .catch((e) => {
          console.log(e);
          setIsFetchingInfo(false);
        });
    } else {
      console.log("no monsterId");
    }
  }, [assetId]);

  useEffect(() => {
    if (nftDetails.length !== 0) {
      getFilefromStorage(nftDetails[0].metaData.mainFileName, {
        decrypt: true,
      }).then((res) => {
        setMainFile(Buffer.from(res.file).toString("base64"));
      });
    }
  }, [nftDetails]);
  return (
    <div>
      {isFetchingInfo ? (
        <>Loading</>
      ) : nftDetails.length === 0 ? (
        <>Cannot fetch info</>
      ) : (
        <>
          <div
            className=" w-44 h-52 bg-center bg-cover rounded-t-xl"
            style={{
              backgroundImage: `url(${nftDetails[0].metaData.prevUri})`,
            }}
          ></div>

          {mainFile ? (
            <img
              alt="test"
              src={`data:${nftDetails[0].metaData.mimeType};base64,${mainFile}`}
            />
          ) : null}
        </>
      )}
    </div>
  );
}

export default NFT;
