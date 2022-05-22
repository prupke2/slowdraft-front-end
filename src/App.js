import React, { useEffect, useState } from "react";
import Login from "./components/Login/Login";
import qs from "query-string";
import AppWrapper from "./components/AppWrapper/AppWrapper";
import Loading from "./components/Loading/Loading";
import "./App.css";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition,
} from "react-toasts";
import dummyIcon from "./assets/dummy_icon.png";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import { useLocation } from "react-router-dom";

export default function App() {
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(true);

  // pub and sub (publish/subscribe) states are used for the chat backend
  const [pub, setPub] = useState(localStorage.getItem("pub") || "");
  const [sub, setSub] = useState(localStorage.getItem("sub") || "");

  const [currentPick, setCurrentPick] = useState({ user_id: null });
  const [picks, setPicks] = useState([]);
  const [draftingNow, setDraftingNow] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
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
    color: null,
  });
  const webToken = localStorage.getItem("web_token");

  useEffect(() => {
    const webToken = localStorage.getItem("web_token") || "";
    const user = JSON.parse(localStorage.getItem("user"));
    if (webToken) {
      setUser(user);
    } else {
      setLoggedIn(false);
    }
    setIsLoading(false);
  }, [code]);

  function logout() {
    localStorage.clear();
    setLoggedIn(false);
    setIsLoading(false);
  }

  return (
    <>
      {isLoading && <Loading />}
      {((!webToken || !loggedIn) && !isLoading) && (
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
      )}
      {(webToken && !isLoading) && (
        <main className={!user ? 'full-width' : null}>
          <ToastsContainer
            store={ToastsStore}
            position={ToastsContainerPosition.TOP_CENTER}
          />
          <ErrorBoundary>
            <AppWrapper
              setLoggedIn={setLoggedIn}
              logout={logout}
              setIsLoading={setIsLoading}
              pub={pub}
              sub={sub}
              user={user}
              picks={picks}
              setPicks={setPicks}
              currentPick={currentPick}
              setCurrentPick={setCurrentPick}
              draftingNow={draftingNow}
              setDraftingNow={setDraftingNow}
              pathname={location.pathname}
            />
          </ErrorBoundary>
        </main>
      )}
      {/* <Switch>
      <Route exact path = '/test'>
        test
      </Route>
      <Route path='asdf'>
        <Login />
      </Route>
      <Route path ={['/', '/#/']}>
        { (!loggedIn || !user) &&
          <Redirect to='/login' /> 
        } 
      </Route>
      <Route path='/login'>
        { console.log(`login route`)}
        { (loggedIn && user) &&
          <>
          { console.log("REDIRECTING TO DRAFT") }
          <Redirect to='/draft' />
          </>
        }
        <>
          { console.log("NOT redir") }
          asdf
          <ToastsContainer 
            store={ToastsStore}
            position={ToastsContainerPosition.TOP_CENTER}
          />
          { isLoading &&
            <Loading />
          }
          { (!isLoading && !loggedIn) &&
            <ErrorBoundary>
              { console.log("login comp") }

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
        </>
      </Route>
    </Switch> */}
      {/* <>
      { !webToken &&
        <Redirect to='/login' />
      }
      { (loggedIn && user) &&
        <main>
          <ToastsContainer 
            store={ToastsStore}
            position={ToastsContainerPosition.TOP_CENTER}
          />
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
              pathname={location.pathname}
            />
          </ErrorBoundary>
        </main>
      }
    </> */}
    </>
  );
}
