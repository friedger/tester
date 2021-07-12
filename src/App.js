import React, { useEffect, useState } from "react";
import "styles/css/app.css";
import { userSession, authOptions, authenticate } from "lib/user/auth";
import { useStxAddresses } from "lib/user/hooks";
import SmartistsUser from "layouts/SmartistsUser";
import User from "layouts/User";
import { Connect } from "@stacks/connect-react";


function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isSigningin, setIsSigningin] = useState(false);
  const [isNewSignIn, setIsNewSignIn] = useState(false);
  const handleSignOut = (e) => {
    e.preventDefault();
    userSession.signUserOut(window.location.origin);
  };

  // const { ownerStxAddress } = useStxAddresses();
  // console.log({ ownerStxAddress });

  useEffect(() => {
    userSession.isUserSignedIn() ? setIsSignedIn(true) : setIsSignedIn(false);
    setIsLoading(false);
  }, []);

  let modifiedAuthOptions = {
    ...authOptions,
    onFinish: async () => {
      const userData = userSession.loadUserData();
      // const { address } = getStacksAccount(userData.appPrivateKey);
      // console.log(JSON.stringify({ address: addressToString(address) }));
      // putStxAddress(userSession, addressToString(address));
      setIsNewSignIn(true);
      setIsSignedIn(true);
    },
  };

  return (
    <Connect authOptions={modifiedAuthOptions}>
      <div>
        <div className="">
          {!isSignedIn ? (
            <button
              onClick={(e) => {
                setIsSigningin(true);
                authenticate(setIsNewSignIn, setIsSignedIn);
              }}
            >
              Login
            </button>
          ) : (
            <button
              onClick={(e) => {
                handleSignOut(e);
              }}
            >
              Signout
            </button>
          )}
        </div>
        {!userSession.isUserSignedIn() ? <User /> : <SmartistsUser />}
      </div>
    </Connect>
  );
}

export default App;
