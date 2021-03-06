import React, { useEffect } from 'react';
import Errors from '../Errors/Errors';
import './Login.css';
import { ToastsStore } from 'react-toasts';

export default function Login({ code, setLoggedIn, setPub, setSub, 
  setIsLoading, user, setUser
  }) {
  const client_id = "dj0yJmk9ZXVsUnFtMm9hSlRqJmQ9WVdrOU1rOU5jWGQzTkhNbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWQ1";
  let errors = null;
  let yahooLoginUrl = "https://api.login.yahoo.com/oauth2/request_auth?client_id=" + client_id + 
      "&redirect_uri=https://slowdraft.herokuapp.com&response_type=code&language=en-us"
      // "&redirect_uri=oob&response_type=code&language=en-us" // for testing login locally

  useEffect(() => {
    function loginUser() {
      setIsLoading(true);
      fetch(`/login/${code}`).then( response => {
        if (!response.ok) throw response
          return response.json()
        })
        .then(data => {
          window.history.replaceState({}, document.title, "/");
          if (data.access_token && data.refresh_token) {
            setPub(data.pub);
            setSub(data.sub);
            localStorage.setItem( 'pub', data.pub );
            localStorage.setItem( 'sub', data.sub );
            setUser(JSON.stringify(data.user));
            localStorage.setItem( 'user', JSON.stringify(data.user) );
            setLoggedIn(true);
            setIsLoading(false);
            const draftTab = document.getElementById('react-tabs-0');
            draftTab.click();
          } else {
            setIsLoading(false)
          }
        })
        .catch( err => {
          ToastsStore.error(`There was an error connecting to the server. Please try again later.`);
          console.log(`Error: ${err.text}`);
          setLoggedIn(false);
        })
    }
    if (typeof(code) !== 'undefined') {
      setIsLoading(true);
      loginUser();
    }
  }, [user]);

  return (
    <div className="App">
      <div className="login-container">
        <h1>Slow<span>Draft</span></h1>
        <p>Fantasy hockey drafting at your own pace</p>
        <p>Currently by invitation only</p>
          { errors != null && (
            <Errors
              code={errors.code}
              message={errors.message}
            />
          )}
        <div className="connect-to-yahoo">
          <a href={yahooLoginUrl}>
            Sign in with &nbsp;
            <img alt="Yahoo" src="yahoo.png" width="57" height="16" />
          </a>
        </div>
      </div>	
    </div>
  );
}
