import React, { useEffect } from 'react';
import Errors from '../Errors/Errors';
import './Login.css';
import { ToastsStore } from 'react-toasts';
import { getDraft } from '../../util/requests';
import { localEnvironment } from '../../util/util';
import { Route, Redirect, Switch } from 'react-router-dom';

export default function Login({ setUser, code, setLoggedIn, setPub, setSub, 
  setIsLoading, setPicks, setCurrentPick, setDraftingNow
  }) {
  const client_id = "dj0yJmk9ZXVsUnFtMm9hSlRqJmQ9WVdrOU1rOU5jWGQzTkhNbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWQ1";
  let errors = null;
  const redirect_uri = localEnvironment() ? "oob" : "https://slowdraft.herokuapp.com";
  const yahooLoginUrl = `https://api.login.yahoo.com/oauth2/request_auth?client_id=${client_id}` + 
      `&redirect_uri=${redirect_uri}&response_type=code&language=en-us`
  console.log(`code: ${code}`);

  useEffect(() => {
    function loginUser() {
      fetch(`/login/${code}`).then( response => {
        if (!response.ok) throw response
          return response.json()
        })
        .then(data => {
          window.history.replaceState({}, document.title, "/");
          if (data.success === true) {
            const user = data.user;
            localStorage.setItem( 'user', JSON.stringify(user));
            setUser(user);
            setPub(data.pub);
            setSub(data.sub);
            localStorage.setItem( 'pub', data.pub );
            localStorage.setItem( 'sub', data.sub );
            localStorage.setItem( 'teams', JSON.stringify(data.teams) );
            localStorage.setItem( 'web_token', data.web_token );
            getDraft(setPicks, setCurrentPick, setDraftingNow);
            setLoggedIn(true);
          } else {
            ToastsStore.error('There was an error logging into Yahoo. Please try again.')
          }
        })
        .catch( error => {
          ToastsStore.error(`There was an error connecting to the server. Please try again later.`);
          console.log(`Error: ${error.text}`);
          setLoggedIn(false);
        })
      setIsLoading(false)
    }
    if (typeof(code) !== 'undefined') {
      setIsLoading(true);
      loginUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <Switch>
      <Route exact path='/login'>
        <div className="App">
          <div className="login-container">
            <h1>
              <span>
                <img className='logo-login' src="hockey_icon_large.png" alt=""/>
              </span>
              Slow<span>Draft</span>
            </h1>
            <div className='info'>Fantasy hockey drafting at your own pace</div>
            <div className='info'>Currently by invitation only</div>
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
          <footer>
            Photo credit: <a href="https://unsplash.com/@k1n1m0de?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Dominik Dombrowski</a> on <a href="https://unsplash.com/s/photos/frozen-pond?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
          </footer>
        </div>
      </Route>
      <Redirect to='/login' />
    </Switch>
  );
}
