import { v4 as uuidv4 } from "uuid";
import { addFileToStorage, deleteFilefromStorage } from "./storage";

export const uploadFile = (file, options, dir, fileName) => {
  return new Promise(function (myResolve, myReject) {
    const name = fileName ? fileName : uuidv4();
    const finalFileName = `${dir ? `${dir}/` : ""}${name}`;
    addFileToStorage(finalFileName, file, options)
      .then((res) => {
        myResolve(res);
      })
      .catch((err) => {
        myReject(err);
      });
  });
};

export const deleteFile = (fileName) => {
  return new Promise(function (myResolve, myReject) {
    deleteFilefromStorage(fileName)
      .then((res) => {
        myResolve(res);
      })
      .catch((err) => {
        myReject(err);
      });
  });
};
