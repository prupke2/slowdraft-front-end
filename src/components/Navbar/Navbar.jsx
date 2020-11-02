import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';

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
    <Tabs className="navbar-tabs">
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
      </TabPanel>
      <TabPanel>
        <h2>tab 3 content</h2>
      </TabPanel>
    </Tabs>
  );
}

