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
  
  return (
    <>
      <Tabs defaultIndex={0} className="navbar-tabs">
        <TabList>
          <Tab><span role='img' aria-label='draft'>⚔️</span><div>Draft</div></Tab>
          <Tab><span role='img' aria-label='skater'>⛸</span><div>Skaters</div></Tab>
          <Tab><span role='img' aria-label='goalie'>🥅</span><div>Goalies</div></Tab>
          <Tab><span role='img' aria-label='teams'>🏒</span><div>Teams</div></Tab>
          <Tab><span role='img' aria-label='forum'>💬</span><div>Forum</div></Tab>
          <Tab><span role='img' aria-label='rules'>📖</span><div>Rules</div></Tab>
          <Tab><span role='img' aria-label='picks'>⛏️</span><div>Pick Tracker</div></Tab>
          { user.role === 'admin' && (
            <Tab><span role='img' aria-label='admin'>✨</span><div>Admin</div></Tab>
          )}
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
            sendChatAnnouncement={sendChatAnnouncement}
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
          )
        }
      </Tabs>
    </>
  );
}

