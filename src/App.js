import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import qs from 'query-string';
import './App.css';
import { getCookie, setCookie } from './assets/Cookies';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const accessCode = getCookie("accessCode");
  const [oauthData, setOauthData] = useState(null);

  const queryParams = qs.parse(window.location.search);
  const code = queryParams["code"];

  function getOauthData() {
    fetch('/oauth_data', {
      method: 'GET',
    })
    .then(response => {
      console.log("response: " + JSON.stringify(response, null, 4))
      return response.json()
    })
    .then(response => {
      setOauthData(response)
      console.log("response 2: " + JSON.stringify(response, null, 4))
      return
    })
    .then(log => {
      console.log("oauthData: " + oauthData);
    })
  }

  if (code) {
    fetch('/login', {
      method: 'GET',
    })
  }

  if (!loggedIn && oauthData === null) {
    getOauthData()
  }

  return (
    <React.Fragment>
      { !loggedIn && (
        <Login 
          loggedIn={loggedIn}
          login={setLoggedIn}
          code={code}
          onClick={getOauthData}
          oauthData={oauthData}
        />
      )}

      { loggedIn && (
        <Navbar />
      )}
    </React.Fragment>
  );
}
