import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import qs from 'query-string';
import './App.css';
import Aux from './hoc/Aux';
import { getCookie } from './assets/Cookies';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  // const [oauthData, setOauthData] = useState(null);
  const queryParams = qs.parse(window.location.search);

  // function getOauthData() {
  //   fetch('/oauth_data', {
  //     method: 'GET',
  //   })
  //   .then(response => {
  //     console.log("response: " + JSON.stringify(response, null, 4))
  //     return response.json()
  //   })
  //   .then(response => {
  //     setOauthData(response)
  //     console.log("response 2: " + JSON.stringify(response, null, 4))
  //     return
  //   })
  //   .then(log => {
  //     console.log("oauthData: " + oauthData);
  //   })
  // }

  const code = getCookie('access_token') || queryParams["code"];

  return (
    <Aux>
      { !loggedIn && (
        <Login 
          loggedIn={loggedIn}
          login={setLoggedIn}
          code={code}
        />
      )}

      { loggedIn && (
        <Navbar />
      )}
    </Aux>
  );
}
