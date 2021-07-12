import { v4 as uuid } from "uuid";
import { userSession } from "./auth";
import { Storage } from "@stacks/storage";

const storage = new Storage({ userSession });
const TASKS_FILENAME = "tasks.json";

// const options = {
//   encrypt: false,
// };

export const addFileToStorage = async (fileName, file, options) => {
  return new Promise(function (myResolve, myReject) {
    storage
      .putFile(fileName, file, options)
      .then((res) => {
        myResolve({ status: true, uri: res, fileName: fileName });
      })
      .catch((err) => {
        console.log(err);
        myReject({ status: false, data: err });
      });
  });
};

export const deleteFilefromStorage = async (fileName) => {
  return new Promise(function (myResolve, myReject) {
    storage
      .deleteFile(fileName)
      .then(() => {
        myResolve({ status: true });
      })
      .catch((err) => {
        console.log(err);
        myReject({ status: false });
      });
  });
};

export const getFilefromStorage = async (fileName, options) => {
  return new Promise(function (myResolve, myReject) {
    storage
      .getFile(fileName, options)
      .then((res) => {
        myResolve({ status: true, file: res });
      })
      .catch((err) => {
        console.log(err);
        myReject({ status: false });
      });
  });
};

export const listFile = async () => {
  let files = []
  storage.listFiles(function (filename) {
        files.push(filename);
        console.log(filename);
        return true; // to continue files listing
      })
      .then(function (filesCount) {
        console.log("Files count: " + filesCount);
      });
  // try {
  //   return await storage.getFile(filename, {
  //     decrypt: false,
  //   });
  // } catch (error) {
  //   console.log(error);
  // }
};

// export const upload = async (file) => {
//   storage.putFile("my-file2", file, options).then(() => {
//     console.log("success");
//     // Handle any execution after data has been saved
//   });
// };

// export const fetch = async (filename) => {
//   try {
//     return await storage.getFile(filename, {
//       decrypt: false,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
