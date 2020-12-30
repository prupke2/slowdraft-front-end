import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './Navbar.css';
import PlayersTab from '../Tabs/PlayersTab/PlayersTab';
import GoaliesTab from '../Tabs/GoaliesTab/GoaliesTab';
import TeamTab from '../Tabs/TeamTab/TeamTab';
import ForumTab from '../Tabs/ForumTab/ForumTab';
import DraftTab from '../Tabs/DraftTab/DraftTab';


export default function Navbar({logout, userPickingNow, setUserPickingNow, pickExpiry, setPickExpiry}) {

  function test() {
    fetch('/test')
  }

  return (
    <>
      <Tabs defaultIndex={0} className="navbar-tabs">
        <TabList>
          <Tab>Draft</Tab>
          <Tab>Skaters</Tab>
          <Tab>Goalies</Tab>
          <Tab>Team</Tab>
          <Tab>Forum</Tab>
          {/* <Tab>Test</Tab> */}
        </TabList>
        <TabPanel>
          <DraftTab 
            userPickingNow={userPickingNow}
            setUserPickingNow={setUserPickingNow}
            pickExpiry={pickExpiry}
            setPickExpiry={setPickExpiry}
          />
        </TabPanel>
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
        {/* <TabPanel>
          <button onClick={test}>test</button>
        </TabPanel> */}
      </Tabs>
      <button id='logout' onClick={logout}>Logout</button>
    </>
  );
}

