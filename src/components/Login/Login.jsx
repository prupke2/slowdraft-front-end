import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Table from '../Table/Table';
// import { fetchToken } from '../../util/actions';
// import { connect } from 'react-redux';
import { 
  Button
} from 'reactstrap';
import Errors from '../Errors/Errors';

export default function Login(props) {
  let token, errors = null;
  let login = props.setLoggedIn;
  let yahooLoginUrl;
  if (props.oauthData) {
    yahooLoginUrl = "https://api.login.yahoo.com/oauth2/request_auth" +
      "?client_id=" + props.oauthData.client_id + 
      "&redirect_uri=" + props.oauthData.redirect_uri + 
      "&response_type=code&language=en-us&state=" + props.oauthData.state;
  }

  const oauthLogin = () => {
    fetch('/login', {
      method: 'GET',
    })
    .then(results => results.json())
    .then(login)
  }

  if (props.code) {
    oauthLogin();
  }

  // TODO: add test for error code handler
  // errors = {
  //   code: 400,
  //   message: "Unable to get access token."
  // }

  return(
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
              <Button
                className="connect-button" 
                onClick={oauthLogin}
              >
                Sign in with &nbsp;
                <img alt="Yahoo" src="yahoo.png" width="57" height="16" />
              </Button>
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
