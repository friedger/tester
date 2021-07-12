import React from "react";
import { useConnect } from "lib/user/auth";

function Authentication(props) {
  const { userSession } = props;
  const { handleSignOut } = useConnect();
  console.log(userSession.isUserSignedIn())
  return (
    <div>
      <button
        className="btn btn-primary btn-lg"
        onClick={() => {
          console.log("signOut");
          handleSignOut();
        }}
      >
        Log Out
      </button>
    </div>
  );
}

export default Authentication;
