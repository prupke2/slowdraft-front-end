import React, { useEffect, useState } from 'react';
import Login from './components/Login/Login';
import qs from 'query-string';
import AppWrapper from './components/AppWrapper/AppWrapper';
import Loading from './components/Loading/Loading';
import './App.css';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
// import { getCookie } from './assets/Cookies';

export default function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  // pub and sub (publish/subscribe) states are used for the chat backend
  const [pub, setPub] = useState(localStorage.getItem( 'pub' ) || ''); 
  const [sub, setSub] = useState(localStorage.getItem( 'sub' ) || '');
  const [isLoading, setIsLoading] = useState(false);
  const queryParams = qs.parse(window.location.search);
  const code = queryParams["code"];
  
  function checkLogin() {
    fetch('/check_login')
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          const error = (data && data.message) || response.status;
          ToastsStore.reject('There was an error connecting to Yahoo. Please try again later');
          return Promise.reject(error);
        }
        if (data.success === true) {
          setPub(data.pub);
          setSub(data.sub);
          localStorage.setItem( 'session', true );
          window.history.replaceState({}, document.title, "/");
          setLoggedIn(true);
        } 
        setIsLoading(false)
      });
  }

  useEffect(() => {
    let session = localStorage.getItem( 'session' ) || false;
    let pub = localStorage.getItem( 'pub' ) || '';

    if (session === null && typeof(code) !== "undefined") {
    // let session = getCookie('access_token');
    // console.log("session: " + session);
    // console.log("type: " + typeof(session));
    // if (typeof(session) === 'undefined') {
    //   console.log("Setting logged in true")
    //   setLoggedIn(true);
    // } else if (!loggedIn && typeof(code) !== "undefined") {
      console.log("Not logged in.")
      checkLogin();
    } else {
      if (pub !== '') {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    }
  }, [code]);

  function logout() {
    fetch('/logout').then(res => res.json()).then(data => {
      console.log("Logging out: " + data.success);
      localStorage.setItem( 'session', false );
      setLoggedIn(false);
      setIsLoading(false);
    });
  }

  return (
    <>
      <ErrorBoundary>
        <ToastsContainer 
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_CENTER}
        />
        { isLoading &&
          <Loading />
        }
        { (!isLoading && !loggedIn) &&
          <ErrorBoundary>          
            <Login 
              code={code}
              setLoggedIn={setLoggedIn}
              setPub={setPub}
              setSub={setSub}
              setIsLoading={setIsLoading}
            />
          </ErrorBoundary>
        }
        { loggedIn &&
          <main>
            <ErrorBoundary >
              <AppWrapper
                logout={logout}
                pub={pub}
                sub={sub}
              />
            </ErrorBoundary>
          </main>
        }
      </ErrorBoundary>

    </>
  );
}


