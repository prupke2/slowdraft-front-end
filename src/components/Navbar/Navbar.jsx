import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';

export default function Navbar() {
  return (
    <Tabs className="navbar-tabs">
      <TabList>
        <Tab>1</Tab>
        <Tab>2</Tab>
        <Tab>3</Tab>
      </TabList>
      <TabPanel>
        <h2>tab 1 content</h2>
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

