import React, { useEffect, useState } from 'react';
import Login from './components/Login/Login';
import qs from 'query-string';
import Aux from './hoc/Aux';
import AppWrapper from './components/AppWrapper/AppWrapper';
import Loading from './components/Loading/Loading';
import './App.css';

export default function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  // pub and sub (publish/subscribe) states are used for the chat backend
  const [pub, setPub] = useState(""); 
  const [sub, setSub] = useState("");
  const [loadingText, setLoadingText] = useState("Loading...");
  const [isLoading, setIsLoading] = useState(true);
  const queryParams = qs.parse(window.location.search);
  const code = queryParams["code"];

  console.log("loggedIn: " + loggedIn);

  useEffect(() => {
    console.log("In App useEffect"); 
    // This is called when the user goes to the site for the first time.
    // If they already have a login session stored, they are logged in.
    if (typeof(code) === "undefined") {
      console.log("fetching check_login");
      fetch('/check_login')
        .then(res => res.json())
        .then(data => {
          if (data.success === true) {
            setPub(data.pub);
            setSub(data.sub);
            window.history.replaceState({}, document.title, "/");
            setLoggedIn(true);
          } else {
            setLoggedIn(false);
          }
          console.log("setting isLoading to false");
          setIsLoading(false)
        }
      );
    } else {
      setIsLoading(false);
    }
  }, [code]);
  
  function logout() {
    fetch('/logout').then(res => res.json()).then(data => {
      console.log("Logging out: " + data.success);
      setLoggedIn(false);
      setIsLoading(false);
      setLoadingText("Loading...");
    });
  }

  return (
    <Aux>
      { isLoading && (
        <Loading 
          text={loadingText}
        />
          
        )
      }
      { (!isLoading && !loggedIn) && (
        <Login 
          code={code}
          setLoggedIn={setLoggedIn}
          setPub={setPub}
          setSub={setSub}
          setIsLoading={setIsLoading}
          setLoadingText={setLoadingText}
        />
      )}
      { (!isLoading && loggedIn) && (
        <AppWrapper
          logout={logout}
          pub={pub}
          sub={sub}
          setLoadingText={setLoadingText}
        />
      )}
    </Aux>
  );
}


