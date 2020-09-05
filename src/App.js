import React, { useState } from 'react';
import './App.css';
import { Button, Popover, PopoverHeader, PopoverBody} from 'reactstrap';
import Table from './components/Table/Table';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

export default function App() {

  const [popoverOpen, setPopoverOpen] = useState(false);
  const toggle = () => setPopoverOpen(!popoverOpen);

    return (
      <div className="App">
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

      </div>
    );
  
}
