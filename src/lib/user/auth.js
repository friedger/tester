import { Person } from "@stacks/profile";
import {
  publicKeyToString,
  publicKeyToAddress,
  getPublicKey,
} from "@stacks/transactions";
import { getPublicKeyFromPrivate } from "@stacks/encryption";
import { Storage } from "@stacks/storage";
import { addressToString } from "@stacks/transactions";
import { getStacksAccount } from "lib/user/account";
import { useCallback } from "react";
import { AppConfig, UserSession } from "@stacks/connect-react";
import { showConnect } from "@stacks/connect";
import { authOrigin } from "./constants";

export const appConfig = new AppConfig(["store_write", "publish_data"]);
export const STX_JSON_PATH = "stx.json";

export const userSession = new UserSession({ appConfig });

export const storage = new Storage({ userSession });

const appDetails = {
  name: "Todos",
  icon: window.location.origin + "/logo.svg",
};

export const authOptions = {
  authOrigin: authOrigin,
  userSession,
  redirectTo: "/",
  manifestPath: "/manifest.json",
  appDetails,
};

export const authenticate = (setIsNewSignIn, setIsSignedIn) => {
  showConnect({
    ...authOptions,
    onFinish: async () => {
      const userData = userSession.loadUserData();
      // console.log(getPublicKeyFromPrivate(userData.appPrivateKey))
      // const { address, publicKey } = getStacksAccount(userData.appPrivateKey);
      // console.log(publicKeyToString(publicKey));
      // console.log(publicKeyToAddress(26, publicKey));
      setIsNewSignIn(true);
      setIsSignedIn(true);
    },
  });
};

export function getUserData() {
  return userSession.loadUserData();
}

export function getPerson() {
  return new Person(getUserData().profile);
}

function afterSTXAddressPublished() {
  console.log("STX address published");
  stxAddressSemaphore.putting = false;
}

const stxAddressSemaphore = { putting: false };

export function putStxAddress(userSession, address) {
  const storage = new Storage({ userSession });
  if (!stxAddressSemaphore.putting) {
    stxAddressSemaphore.putting = true;
    storage
      .putFile(STX_JSON_PATH, JSON.stringify({ address }), {
        encrypt: false,
      })
      .then(() => afterSTXAddressPublished())
      .catch((r) => {
        storage.getFile(STX_JSON_PATH, { decrypt: false }).then((s) => {
          console.log({ s });
          storage
            .putFile(STX_JSON_PATH, JSON.stringify({ address }), {
              encrypt: false,
            })
            .then(() => afterSTXAddressPublished())
            .catch((r) => {
              console.log("STX address NOT published");
              console.log(r);
              stxAddressSemaphore.putting = false;
            });
        });
      });
  }
}
