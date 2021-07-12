import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import LandingPage from "pages/User/LandingPage";

function User() {
  return (
    <>
      <Switch>
        <Route
          exact
          path="/"
          Component
          render={(routeProps) => <LandingPage {...routeProps} />}
        />
      </Switch>
    </>
  );
}

export default User;
