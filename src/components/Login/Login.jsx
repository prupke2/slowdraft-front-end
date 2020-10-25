import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Table from '../Table/Table';
import { 
  Button
} from 'reactstrap';
import Errors from '../Errors/Errors';


export default function Login(props) {

  let token, errors = null;

  function oauthLogin() {
    fetch('/login', {
      method: 'GET',
    })
    .then(results => results.json())
    .then(props.setLoggedIn);
  }

  // TODO: add test for error code handler
  // errors = {
  //   code: 400,
  //   message: "Unable to get access token."
  // }

  return(
    <div className="App">
      {props.loginStatus === false && (
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
                onClick={oauthLogin()}
              >
                Sign in with &nbsp;
                <img alt="Yahoo" src="yahoo.png" width="57" height="16" />
              </Button>
            </div>
          </div>	
      )}

      {props.loginStatus === true && (

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
