import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import LandingPage from "pages/SmartistsUser/LandingPage";
import MyNFT from "pages/SmartistsUser/MyNFT";
import Test from "pages/Test";

function SmartistsUser() {
  return (
    <>
      <Switch>
        <Route
          exact
          path="/"
          Component
          render={(routeProps) => <LandingPage {...routeProps} />}
        />

        <Route
          exact
          path="/my-nft"
          Component
          render={(routeProps) => <MyNFT {...routeProps} />}
        />

        <Route
          exact
          path="/test"
          Component
          render={(routeProps) => <Test {...routeProps} />}
        />
      </Switch>
    </>
  );
}

export default SmartistsUser;
