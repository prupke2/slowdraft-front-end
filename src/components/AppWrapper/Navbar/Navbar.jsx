import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './Navbar.css';
import Aux from '../../../hoc/Aux';
import PlayersTab from '../Tabs/PlayersTab/PlayersTab';
import TeamTab from '../Tabs/TeamTab/TeamTab';

export default function Navbar({logout}) {
  // useEffect example
  // useEffect(() => {
  //   fetch('/test').then(res => res.json()).then(data => {
  //     setCurrentTime(data.test);
  //   });
  // }, [update]);

  return (
    <Aux>
      <Tabs defaultIndex={1} className="navbar-tabs">
        <TabList>
          <Tab>Players</Tab>
          <Tab>Team</Tab>
          <Tab>Forum</Tab>
        </TabList>
        <TabPanel>
          <PlayersTab />
        </TabPanel>
        <TabPanel>
          <TeamTab />
        </TabPanel>
        <TabPanel>
          <h2>tab 3 content</h2>
        </TabPanel>
      </Tabs>
      <button id='logout' onClick={logout}>Logout</button>
    </Aux>
  );
}

