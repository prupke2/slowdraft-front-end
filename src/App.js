import React, { useEffect, useState } from 'react';
import Login from './components/Login/Login';
import qs from 'query-string';
import Aux from './hoc/Aux';
import AppWrapper from './components/AppWrapper/AppWrapper';
import './App.css';

export default function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [pub, setPub] = useState("");
  const [sub, setSub] = useState("");
  const queryParams = qs.parse(window.location.search);
  const code = queryParams["code"];

  useEffect(() => {
    fetch('/check_login').then(res => res.json()).then(data => {
      if (data.success === true) {
        setPub(data.pub);
        setSub(data.sub);
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

      { (loggedIn && pub !== "") && (
        <AppWrapper
          logout={logout}
          pub={pub}
          sub={sub}
        />
      )}
    </Aux>
  );
}


