import React from "react";
import { uploadFile } from "../lib/user/media";
import { getFilefromStorage } from "lib/user/storage";
import axios from "axios";

import { userSession } from "lib/user/auth";

function Test() {
  let fileData = {
    color: "blue",
    electric: true,
    purchaseDate: "2019-04-03",
  };

  const testUpload = () => {
    console.log(userSession);
    const userData = userSession.loadUserData();
    axios
      .get(
        `https://gaia.blockstack.org/hub/1MncdiUqkxw61HuxeSeFfvm3GWm7mDrtyK/c7853232-d7a0-49de-8b8f-8c71fe607529`
      )
      .then((res) => {
        //   console.log(JSON.stringify(res.data))
        return userSession.decryptContent(JSON.stringify(res.data));
      })
      .then((res) => {
        console.log(res);
      }).catch((err)=>{
          console.log(err)
      })
    // getFilefromStorage('c7853232-d7a0-49de-8b8f-8c71fe607529', {decrypt: '03fbfc6bebae28b83583f8b18755c075e24109cfcc0b1d82f54cd0e2721fcb6b7d',}).then((res)=>{
    //     console.log(res)
    // })
    // uploadFile(JSON.stringify(fileData), {
    //   encrypt:
    //     "03fbfc6bebae28b83583f8b18755c075e24109cfcc0b1d82f54cd0e2721fcb6b7d",
    // }).then((res) => {
    //   console.log(res);
    // });
  };
  return (
    <div>
      <button
        onClick={(e) => {
          testUpload();
        }}
      >
        Test
      </button>
    </div>
  );
}

export default Test;
