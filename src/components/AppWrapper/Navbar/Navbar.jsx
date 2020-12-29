import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './Navbar.css';
import PlayersTab from '../Tabs/PlayersTab/PlayersTab';
import GoaliesTab from '../Tabs/GoaliesTab/GoaliesTab';
import TeamTab from '../Tabs/TeamTab/TeamTab';
import ForumTab from '../Tabs/ForumTab/ForumTab';

export default function Navbar({logout}) {

  function test() {
    fetch('/test')
  }

  return (
    <>
      <Tabs defaultIndex={4} className="navbar-tabs">
        <TabList>
          <Tab>Skaters</Tab>
          <Tab>Goalies</Tab>
          <Tab>Team</Tab>
          <Tab>Forum</Tab>
          <Tab>Test</Tab>
        </TabList>
        <TabPanel>
          <PlayersTab />
        </TabPanel>
        <TabPanel>
          <GoaliesTab />
        </TabPanel>
        <TabPanel>
          <TeamTab />
        </TabPanel>
        <TabPanel>
          <ForumTab />
        </TabPanel>
        <TabPanel>
          <button onClick={test}>test</button>
        </TabPanel>
      </Tabs>
      <button id='logout' onClick={logout}>Logout</button>
    </>
  );
}

