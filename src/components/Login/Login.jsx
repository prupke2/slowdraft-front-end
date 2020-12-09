import React from 'react';
import Table from '../Table/Table';
import Errors from '../Errors/Errors';
import './Login.css';
import { setCookie } from '../../assets/Cookies';
import 'axios';

export default function Login({ code }) {
  const client_id = "dj0yJmk9ZnBhT05mU3JBYnJDJmQ9WVdrOWJrWjBXRlpSYlVNbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTAz"
  let errors = null;
  let yahooLoginUrl = "https://api.login.yahoo.com/oauth2/request_auth?client_id=" + client_id + 
      "&redirect_uri=https://slowdraft.herokuapp.com&response_type=code&language=en-us"
      // "&redirect_uri=oob&response_type=code&language=en-us" // for local testing

  function oauthLogin() {
    fetch(`/login/${code}`, {
      method: 'GET',
    })
    .then(results => results.json())
    .then(data => {
      console.log(data);
      setCookie('access_token', data.access_token);
      setCookie('refresh_token', data.refresh_token);
      window.history.replaceState({}, document.title, "/");
    });
  }

  if (code) {
    oauthLogin();
  }

  // TODO: add test for error code handler
  // errors = {
  //   code: 400,
  //   message: "Unable to get access token."
  // }

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
