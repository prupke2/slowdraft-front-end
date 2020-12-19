import React, { useEffect, useState } from 'react';
import Login from './components/Login/Login';
import qs from 'query-string';
import AppWrapper from './components/AppWrapper/AppWrapper';
import Loading from './components/Loading/Loading';
import './App.css';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';

export default function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  // pub and sub (publish/subscribe) states are used for the chat backend
  const [pub, setPub] = useState(""); 
  const [sub, setSub] = useState("");
  const [error, setError] = useState("");
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
      try {
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
      } catch(error) {
        console.log("Error in App useEffect")
        setError("Unable to reach Yahoo. " + error)
        setIsLoading(false);
      }
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
    <div>
      <ToastsContainer 
        store={ToastsStore}
        position={ToastsContainerPosition.TOP_CENTER}
      />
      { error && (
        <div>{error}</div>
      )}
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
      { loggedIn && (
        <main>
          <AppWrapper
            logout={logout}
            pub={pub}
            sub={sub}
            setLoadingText={setLoadingText}
          />
        </main>
      )}
    </div>
  );
}


