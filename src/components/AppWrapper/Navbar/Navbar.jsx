import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './Navbar.css';
import PlayersTab from '../Tabs/PlayersTab/PlayersTab';
import GoaliesTab from '../Tabs/GoaliesTab/GoaliesTab';
import TeamTab from '../Tabs/TeamTab/TeamTab';
import ForumTab from '../Tabs/ForumTab/ForumTab';
import DraftTab from '../Tabs/DraftTab/DraftTab';

export default function Navbar({logout, setUserPickingNow, setPickExpiry, draftingNow, teamName, sendChatAnnouncement}) {

  // function test() {
  //   fetch('/test')
  // }
  
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
            setUserPickingNow={setUserPickingNow}
            setPickExpiry={setPickExpiry}
            draftingNow={draftingNow}
          />
        </TabPanel>
        <TabPanel>
          <PlayersTab 
            draftingNow={draftingNow}
            teamName={teamName}
            sendChatAnnouncement={sendChatAnnouncement}
          />
        </TabPanel>
        <TabPanel>
          <GoaliesTab 
            draftingNow={draftingNow}
            teamName={teamName}
            sendChatAnnouncement={sendChatAnnouncement}
          />
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

