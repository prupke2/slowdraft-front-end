import React, { useEffect, useState } from 'react';
import Login from './components/Login/Login';
import qs from 'query-string';
import './App.css';
import Aux from './hoc/Aux';
import AppWrapper from './components/AppWrapper/AppWrapper';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const queryParams = qs.parse(window.location.search);
  const code = queryParams["code"];

  useEffect(() => {
    fetch('/check_login').then(res => res.json()).then(data => {
      if (data.success === true) {
        window.history.replaceState({}, document.title, "/");
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, []);
  
  function logout() {
    fetch('/logout').then(res => res.json()).then(data => {
      console.log(data.success);
      setLoggedIn(false);
    });
  }

  return (
    <Aux>
      { !loggedIn && (
        <Login 
          code={code}
          login={setLoggedIn}
          />
        )}

      { loggedIn && (
        <React.Fragment>
          <AppWrapper
          />
          <button onClick={logout}>Logout</button>
        </React.Fragment>
      )}
    </Aux>
  );
}
