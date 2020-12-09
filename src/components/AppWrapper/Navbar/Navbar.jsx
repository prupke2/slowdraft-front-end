import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './Navbar.css';
import Aux from '../../../hoc/Aux';
import Table from '../../Table/Table';

export default function Navbar() {
  const [currentTime, setCurrentTime] = useState();
  function update() {
    fetch('/test').then(res => res.json()).then(data => {
      setCurrentTime(data.test);
    });
  }
  // useEffect example
  // useEffect(() => {
  //   fetch('/test').then(res => res.json()).then(data => {
  //     setCurrentTime(data.test);
  //   });
  // }, [update]);

  return (
    <Aux>
      <Tabs defaultIndex={0} className="navbar-tabs">
        <TabList>
          <Tab>1</Tab>
          <Tab>2</Tab>
          <Tab>3</Tab>
        </TabList>
        <TabPanel>
          <h2>tab 1 content</h2>
          <button onClick={update}>test</button>
          Test: {currentTime}
        </TabPanel>
        <TabPanel>
          <h2>tab 2 content</h2>
          <Table />
        </TabPanel>
        <TabPanel>
          <h2>tab 3 content</h2>
        </TabPanel>
      </Tabs>
    </Aux>
  );
}

