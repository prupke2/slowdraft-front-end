import React, { useEffect } from 'react';
import Login from './components/Login/Login';
import qs from 'query-string';
import './App.css';
import Aux from './hoc/Aux';
import { getCookie, deleteCookie } from './assets/Cookies';
import AppWrapper from './components/AppWrapper/AppWrapper';

export default function App() {
  // const [loggedIn, setLoggedIn] = useState(false);
  const queryParams = qs.parse(window.location.search);
  const code = queryParams["code"];
  let yahooSession = true;
  // let yahooSession = getCookie('access_token') ? true : false;
  console.log("yahooSession: " + yahooSession);

  useEffect(() => {
    if (yahooSession) {
      window.history.replaceState({}, document.title, "/");
    } 
  }, [yahooSession]);
  
  function logout() { 
    deleteCookie("access_token");
    yahooSession = false;
  }

  console.log("yahoo: " + yahooSession);
  return (
    <Aux>
      { !yahooSession && (
        <Login 
          code={code}
          />
        )}

      { yahooSession && (
        <React.Fragment>
          <AppWrapper
          />
          <button onClick={logout}>Logout</button>
        </React.Fragment>
      )}
    </Aux>
  );
}
