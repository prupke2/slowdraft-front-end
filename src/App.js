import React, { useEffect, useState } from 'react';
import Login from './components/Login/Login';
import qs from 'query-string';
import AppWrapper from './components/AppWrapper/AppWrapper';
import Loading from './components/Loading/Loading';
import './App.css';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

export default function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  // pub and sub (publish/subscribe) states are used for the chat backend
  const [pub, setPub] = useState(""); 
  const [sub, setSub] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryParams = qs.parse(window.location.search);
  const code = queryParams["code"];

  // const { data, loading, requestError } = useRequest('/check_login');
  
  function checkLogin() {
    // if (typeof(code) !== "undefined") {
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
          window.history.replaceState({}, document.title, "/");
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
        setIsLoading(false)
      });
    // }
  }

  useEffect(() => {
    if (!loggedIn && typeof(code) !== "undefined") {
      console.log("Not logged in.")
      checkLogin();
    }
  }, [code]);

  function logout() {
    fetch('/logout').then(res => res.json()).then(data => {
      console.log("Logging out: " + data.success);
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


