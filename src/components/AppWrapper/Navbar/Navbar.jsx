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
  sendChatAnnouncement, role, players, setPlayers, goalies, setGoalies,
  teams, setTeams, posts, setPosts, rules, setRules, user, setUser
}) {

  // function test() {
  //   fetch('/test')
  // }
  
  return (
    <>
      <Tabs defaultIndex={1} className="navbar-tabs">
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
            user={user}
            setUser={setUser}
          />
        </TabPanel>
        <TabPanel>
          <PlayersTab 
            draftingNow={draftingNow}
            sendChatAnnouncement={sendChatAnnouncement}
            players={players}
            setPlayers={setPlayers}
            user={user}
          />
        </TabPanel>
        <TabPanel>
          <GoaliesTab 
            draftingNow={draftingNow}
            sendChatAnnouncement={sendChatAnnouncement}
            goalies={goalies}
            setGoalies={setGoalies}
            user={user}
          />
        </TabPanel>
        <TabPanel>
          <TeamsTab 
            teams={teams}
            setTeams={setTeams}
            user={user}
          />
        </TabPanel>
        <TabPanel>
          <ForumTab 
            user={user}
            posts={posts}
            setPosts={setPosts}
          />
        </TabPanel>
        <TabPanel>
          <RulesTab
            user={user}
            rules={rules}
            setRules={setRules}
          />
        </TabPanel>
        {/* <TabPanel>
          <button onClick={test}>test</button>
        </TabPanel> */}
      </Tabs>
    </>
  );
}

