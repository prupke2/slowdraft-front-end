import React, { useEffect } from 'react';
import Errors from '../Errors/Errors';
import './Login.css';

export default function Login({ code, setLoggedIn, setPub, setSub, setIsLoading }) {
  const client_id = "dj0yJmk9ZXVsUnFtMm9hSlRqJmQ9WVdrOU1rOU5jWGQzTkhNbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWQ1";
  let errors = null;
  let yahooLoginUrl = "https://api.login.yahoo.com/oauth2/request_auth?client_id=" + client_id + 
      "&redirect_uri=https://slowdraft.herokuapp.com&response_type=code&language=en-us"
      // "&redirect_uri=oob&response_type=code&language=en-us" // for testing login locally

  function loginUser() {
    setIsLoading(true);
    console.log("fetching /login/code");
    fetch(`/login/${code}`)
      .then(res => res.json())
      .then(data => {
        // return data;
        window.history.replaceState({}, document.title, "/");
        if (data.access_token && data.refresh_token) {
          console.log("setting loggedIn to true");
          setPub(data.pub);
          setSub(data.sub);
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      }
      ).then(
        setIsLoading(false)
      );
  }

  useEffect(() => {
    console.log("in Login useEffect");
    if (typeof(code) !== "undefined") {
      console.log("Code is " + code + ", setting loading to true");
      setIsLoading(true);
      loginUser();
    }
    // const fetchData = async () => {
    //   console.log("data before: " + JSON.stringify(data, null, 4));

    //   const data = await loginUser();
    //   // if (data !== '') {
    //     console.log("data after: " + JSON.stringify(data, null, 4));
    //     window.history.replaceState({}, document.title, "/");
    //     if (data.access_token && data.refresh_token) {
    //       console.log("setting loggedIn to true");
    //       login(true);
    //     } else {
    //       login(false);
    //     }
    //   // }
    // }
    // fetchData();
  }, [code]);

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
