import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Table from '../Table/Table';
import Errors from '../Errors/Errors';
import './Login.css';

export default function Login(props) {
  const client_id = "dj0yJmk9ZnBhT05mU3JBYnJDJmQ9WVdrOWJrWjBXRlpSYlVNbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTAz"
  let errors = null;
  let login = props.setLoggedIn;
  let yahooLoginUrl = "https://api.login.yahoo.com/oauth2/request_auth?client_id=" + client_id + 
      "&redirect_uri=https://slowdraft.herokuapp.com/login&response_type=code&language=en-us"

  const oauthLogin = () => {
    if (props.oauthData) {
      fetch('/login' + props.code, {
        method: 'GET',
      })
      .then(results => results.json())
      .then(login)
    }
  }

  if (props.code) {
    console.log("props.code: " + props.code);
    oauthLogin();
  }

  // TODO: add test for error code handler
  // errors = {
  //   code: 400,
  //   message: "Unable to get access token."
  // }

  return (
    <div className="App">
      {props.loggedIn === false && (
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
      )}

      {props.loggedIn === true && (

        <Tabs className="navbar-tabs">
          <TabList>
              <Tab>1</Tab>
              <Tab>2</Tab>
              <Tab>3</Tab>
          </TabList>
          <TabPanel>
            <h2>tab 1 content</h2>
            <Table />
          </TabPanel>
          <TabPanel>
            <h2>tab 2 content</h2>
          </TabPanel>
          <TabPanel>
            <h2>tab 3 content</h2>
          </TabPanel>
        </Tabs>

      )}
    </div>
  );
}
