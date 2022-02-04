import React, { useEffect, useState } from 'react';
import Login from './components/Login/Login';
import qs from 'query-string';
import AppWrapper from './components/AppWrapper/AppWrapper';
import Loading from './components/Loading/Loading';
import './App.css';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import dummyIcon from './assets/dummy_icon.png';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

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
    team_key: null,
    user_id: null,
    logo: dummyIcon,
    team_name: null, 
    league_id: null, 
    draft_id: null,
    role: null, 
    color: null
  });

  useEffect(() => {
    const webToken = localStorage.getItem( 'web_token' ) || '';
    const user = JSON.parse(localStorage.getItem('user'));

    if (webToken) {
      setUser(user);
      setLoggedIn(true);
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
        { (loggedIn && user) &&
          <main>
            <ErrorBoundary >
              <AppWrapper
                setLoggedIn={setLoggedIn}
                logout={logout}
                pub={pub}
                sub={sub}
                user={user}
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


