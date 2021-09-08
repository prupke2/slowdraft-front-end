import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './Navbar.css';
import PlayersTab from '../Tabs/PlayersTab/PlayersTab';
import GoaliesTab from '../Tabs/GoaliesTab/GoaliesTab';
import TeamsTab from '../Tabs/TeamsTab/TeamsTab';
import ForumTab from '../Tabs/ForumTab/ForumTab';
import DraftTab from '../Tabs/DraftTab/DraftTab';
import RulesTab from '../Tabs/RulesTab/RulesTab';
import AdminTab from '../Tabs/AdminTab/AdminTab';
import PickTrackerTab from '../Tabs/PickTrackerTab/PickTrackerTab';

export default function Navbar({
  currentPick, setCurrentPick, picks, setPicks, draftingNow, setDraftingNow, userId, 
  sendChatAnnouncement, role, players, setPlayers, goalies, setGoalies,
  teams, setTeams, posts, setPosts, rules, setRules, user, setUser, getLatestData
}) {

  // function test() {
  //   fetch('/test')
  // }
  
  return (
    <>
      <Tabs defaultIndex={0} className="navbar-tabs">
        <TabList>
          <Tab><span role='img' aria-label='draft'>⚔️</span> Draft</Tab>
          <Tab><span role='img' aria-label='skater'>⛸</span> Skaters</Tab>
          <Tab><span role='img' aria-label='goalie'>🥅</span> Goalies</Tab>
          <Tab><span role='img' aria-label='teams'>🏒</span> Teams</Tab>
          <Tab><span role='img' aria-label='forum'>💬</span> Forum</Tab>
          <Tab><span role='img' aria-label='rules'>📖</span> Rules</Tab>
          <Tab><span role='img' aria-label='picks'>⛏️</span> Pick Tracker</Tab>
          { user.role === 'admin' && (
            <Tab><span role='img' aria-label='admin'>✨</span> Admin</Tab>
          )}
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
            getLatestData={getLatestData}
          />
        </TabPanel>
        <TabPanel>
          <PlayersTab 
            setPicks={setPicks}
            setCurrentPick={setCurrentPick}
            draftingNow={draftingNow}
            setDraftingNow={setDraftingNow}
            sendChatAnnouncement={sendChatAnnouncement}
            players={players}
            setPlayers={setPlayers}
            setTeams={setTeams}
            user={user}
            getLatestData={getLatestData}
          />
        </TabPanel>
        <TabPanel>
          <GoaliesTab 
            setPicks={setPicks}
            setCurrentPick={setCurrentPick}
            draftingNow={draftingNow}
            setDraftingNow={setDraftingNow}
            sendChatAnnouncement={sendChatAnnouncement}
            goalies={goalies}
            setGoalies={setGoalies}
            setTeams={setTeams}
            user={user}
            getLatestData={getLatestData}
          />
        </TabPanel>
        <TabPanel>
          <TeamsTab 
            teams={teams}
            setTeams={setTeams}
            user={user}
            getLatestData={getLatestData}
          />
        </TabPanel>
        <TabPanel>
          <ForumTab 
            user={user}
            posts={posts}
            setPosts={setPosts}
            getLatestData={getLatestData}
          />
        </TabPanel>
        <TabPanel>
          <RulesTab
            user={user}
            rules={rules}
            setRules={setRules}
            getLatestData={getLatestData}
          />
        </TabPanel>
        <TabPanel>
          <PickTrackerTab />
        </TabPanel>
        { user.role === 'admin' && (
          <TabPanel>
            <AdminTab />
          </TabPanel>
          )}
        {/* <TabPanel>
          <button onClick={test}>test</button>
        </TabPanel> */}
      </Tabs>
    </>
  );
}

