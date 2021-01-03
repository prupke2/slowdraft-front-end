import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './Navbar.css';
import PlayersTab from '../Tabs/PlayersTab/PlayersTab';
import GoaliesTab from '../Tabs/GoaliesTab/GoaliesTab';
import TeamsTab from '../Tabs/TeamsTab/TeamsTab';
import ForumTab from '../Tabs/ForumTab/ForumTab';
import DraftTab from '../Tabs/DraftTab/DraftTab';
import RulesTab from '../Tabs/RulesTab/RulesTab';

export default function Navbar({
  currentPick, setCurrentPick, picks, setPicks, draftingNow, setDraftingNow, userId, 
  teamName, sendChatAnnouncement, role, players, setPlayers, goalies, setGoalies
}) {

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
          <Tab>Teams</Tab>
          <Tab>Forum</Tab>
          <Tab>Rules</Tab>
          {/* <Tab>Test</Tab> */}
        </TabList>
        <TabPanel>
          <DraftTab 
            currentPick={currentPick}
            setCurrentPick={setCurrentPick}
            draftingNow={draftingNow}
            setDraftingNow={setDraftingNow}
            userId={userId}
            picks={picks}
            setPicks={setPicks}
            role={role}
          />
        </TabPanel>
        <TabPanel>
          <PlayersTab 
            draftingNow={draftingNow}
            teamName={teamName}
            sendChatAnnouncement={sendChatAnnouncement}
            players={players}
            setPlayers={setPlayers}
          />
        </TabPanel>
        <TabPanel>
          <GoaliesTab 
            draftingNow={draftingNow}
            teamName={teamName}
            sendChatAnnouncement={sendChatAnnouncement}
            goalies={goalies}
            setGoalies={setGoalies}
          />
        </TabPanel>
        <TabPanel>
          <TeamsTab 
            teamName={teamName}
          />
        </TabPanel>
        <TabPanel>
          <ForumTab />
        </TabPanel>
        <TabPanel>
          <RulesTab
            role={role}
          />
        </TabPanel>
        {/* <TabPanel>
          <button onClick={test}>test</button>
        </TabPanel> */}
      </Tabs>
    </>
  );
}

