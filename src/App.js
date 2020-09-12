import React, { useState } from 'react';
import './App.css';
import { Button, Popover, PopoverHeader, PopoverBody} from 'reactstrap';
import Table from './components/Table/Table';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

export default function App() {

  const [popoverOpen, setPopoverOpen] = useState(false);
  const toggle = () => setPopoverOpen(!popoverOpen);
  let loggedIn = false;

    return (
      <div className="App">
        {loggedIn === false && (
            <div class="login-container">
              <h1>Slow<span>Draft</span></h1>
              <p>Fantasy hockey drafting at your own pace</p>
              <p>Currently by invitation only</p>
      
                <div>
                  Unable to get access token.
                  <p>Response:</p>
                  <p>Error message:</p>
                </div>
                <div class="connect-to-yahoo">
                  <div>
                    <Button class="connect-button" href="{{yahoo_auth_url}}">Sign in with Yahoo
                      {/* <img alt="Yahoo" src="" width="82.3" height="14"> */}
                    </Button>
                  </div>
                </div>
        
            </div>	
        )}

        {loggedIn === true && (

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
