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
  teams, setTeams, posts, setPosts, rules, setRules, user, setUser
}) {


  // function test() {
  //   fetch('/test')
  // }
  
  return (
    <>
      <Tabs defaultIndex={0} className="navbar-tabs">
        <TabList>
          <Tab>⚔️ Draft</Tab>
          <Tab>⛸ Skaters</Tab>
          <Tab>🥅 Goalies</Tab>
          <Tab>🏒 Teams</Tab>
          <Tab>💬 Forum</Tab>
          <Tab>📖 Rules</Tab>
          <Tab>⛏️ Pick Tracker</Tab>
          { user.role === 'admin' && (
            <Tab>✨ Admin</Tab>
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
        <TabPanel>
          <PickTrackerTab />
        </TabPanel>
        { user.role === 'admin' && (
          <TabPanel>
            <AdminTab
              user={user}
            />
          </TabPanel>
          )}
        {/* <TabPanel>
          <button onClick={test}>test</button>
        </TabPanel> */}
      </Tabs>
    </>
  );
}

