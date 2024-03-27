import React, { useEffect } from "react";
import Errors from "../Errors/Errors";
import "./Login.css";
import { ToastsStore } from "react-toasts";
import { getDraft, getForumPosts, getRules, getWatchlistIds } from "../../util/requests";
import { localEnvironment, binaryToBoolean, API_URL } from "../../util/util";
import { Route, Redirect, Switch } from "react-router-dom";
import { useState } from "react";

export default function Login({
  code,
  setCode,
  setLoggedIn,
  isLoading,
  setIsLoading,
  setCurrentPick,
  setDraftingNow,
}) {
  const client_id =
    "dj0yJmk9ZXVsUnFtMm9hSlRqJmQ9WVdrOU1rOU5jWGQzTkhNbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWQ1";
  let errors = null;
  const redirect_uri = localEnvironment() ? "oob" : "https://slowdraft.vercel.app";
  const yahooLoginUrl =
    `https://api.login.yahoo.com/oauth2/request_auth?client_id=${client_id}` +
    `&redirect_uri=${redirect_uri}&response_type=code&language=en-us`;
  const [lastLoginTimestamp, setLastLoginTimestamp] = useState(null);
  useEffect(() => {
    function loginUser() {
      setIsLoading(true);
      const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": `${API_URL}/login`,
      }
      fetch(`${API_URL}/login/${code}`,{
        method: "GET",
        headers: headers,
      })
        .then((response) => {
          if (!response.ok) throw response;
          return response.json();
        })
        .then((data) => {
          window.history.replaceState({}, document.title, "/");
          if (data.success === true) {
            const user = data.user;
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("teams", JSON.stringify(data.teams));
            localStorage.setItem("web_token", data.web_token);
            localStorage.setItem("registeredLeague", data.registered);
            localStorage.setItem("leagueList", JSON.stringify(data.league_list));
            localStorage.setItem(
              "liveDraft",
              binaryToBoolean(data.is_live_draft)
            );
            if (user) {
              getDraft(setCurrentPick, setDraftingNow);
              getWatchlistIds();
              getForumPosts();
              getRules();
            }
            setLoggedIn(true);
            setIsLoading(false);
          } else {
            setLoggedIn(false);
            setIsLoading(false);
            // if (localStorage.getItem('user') === null) {
              ToastsStore.error(
                "There was an error logging into Yahoo. Please try again."
              );
            // }
          }
        })
        .catch((error) => {
          console.log('error:', error);

          ToastsStore.error(
            `There was an error connecting to the server. Please try again later. Error: ${error?.text}`
          );
          console.log(`error text: ${JSON.stringify(error?.text, null, 4)}`);
          setLoggedIn(false);
        })
        .finally(() => {
          setCode('');
        });
      // setTimeout(() => {
      //   setIsLoading(false);
      // }, 1000);
    }
    const now = new Date();

    if (typeof code !== "undefined" && !isLoading && (!lastLoginTimestamp || lastLoginTimestamp + 10 < now)) {
      const newLoginDate = new Date();
      setLastLoginTimestamp(newLoginDate);
      setIsLoading(true);
      loginUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <Switch>
      <Route exact path="/login">
        <div className="App">
          <div className="login-container">
            <h1>
              <span>
                <img
                  className="logo-login"
                  src="hockey_icon_large.png"
                  alt=""
                  title="SlowDraft"
                />
              </span>
              Slow<span>Draft</span>
            </h1>
            <div className="info">Fantasy hockey drafting at your own pace</div>
            <div className="info">Currently by invitation only</div>
            {errors != null && (
              <Errors code={errors.code} message={errors.message} />
            )}
            <div className="connect-to-yahoo">
              <a href={yahooLoginUrl}>
                Sign in with &nbsp;
                <img alt="Yahoo" src="yahoo.png" width="57" height="16" />
              </a>
            </div>
          </div>
          <footer>
            Photo credit:{" "}
            <a href="https://unsplash.com/@k1n1m0de?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
              Dominik Dombrowski
            </a>{" "}
            on{" "}
            <a href="https://unsplash.com/s/photos/frozen-pond?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
              Unsplash
            </a>
          </footer>
        </div>
      </Route>
      <Redirect to="/login" />
    </Switch>
  );
}
