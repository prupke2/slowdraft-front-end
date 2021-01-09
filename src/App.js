import React, { useEffect, useState } from 'react';
import Login from './components/Login/Login';
import qs from 'query-string';
import AppWrapper from './components/AppWrapper/AppWrapper';
import Loading from './components/Loading/Loading';
import './App.css';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import dummyIcon from './assets/dummy_icon.png';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
// import { getCookie } from './assets/Cookies';

export default function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  // pub and sub (publish/subscribe) states are used for the chat backend
  const [pub, setPub] = useState(localStorage.getItem( 'pub' ) || ''); 
  const [sub, setSub] = useState(localStorage.getItem( 'sub' ) || '');

  const [currentPick, setCurrentPick] = useState({user_id: null});
  const [picks, setPicks] = useState([]);
  const [draftingNow, setDraftingNow] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const queryParams = qs.parse(window.location.search);
  const code = queryParams["code"];
  const [user, setUser] = useState({
    user_id: null,
    logo: dummyIcon,
    team_name: null, 
    league_id: null, 
    draft_id: null,
    role: null, 
    color: null
  });
  
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
          localStorage.setItem( 'pub', data.pub );
          localStorage.setItem( 'sub', data.sub );
          localStorage.setItem( 'user', data.user );
          localStorage.setItem( 'yahooSession', true );
          window.history.replaceState({}, document.title, "/");
          setLoggedIn(true);
        } 
        setIsLoading(false)
      });
  }

  useEffect(() => {
    let yahooSession = localStorage.getItem( 'yahooSession' ) || false;
    let pub = localStorage.getItem( 'pub' ) || '';

    if (yahooSession === null && typeof(code) !== "undefined") {
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
      localStorage.clear();
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
              user={user}
              setUser={setUser}
              setPicks={setPicks}
              currentPick={currentPick}
              setCurrentPick={setCurrentPick}
              draftingNow={draftingNow}
              setDraftingNow={setDraftingNow}
            />
          </ErrorBoundary>
        }
        { loggedIn &&
          <main>
            <ErrorBoundary >
              <AppWrapper
                setLoggedIn={setLoggedIn}
                logout={logout}
                pub={pub}
                sub={sub}
                user={user}
                setUser={setUser}
                picks={picks}
                setPicks={setPicks}
                currentPick={currentPick}
                setCurrentPick={setCurrentPick}
                draftingNow={draftingNow}
                setDraftingNow={setDraftingNow}
              />
            </ErrorBoundary>
          </main>
        }
      </ErrorBoundary>

    </>
  );
}


