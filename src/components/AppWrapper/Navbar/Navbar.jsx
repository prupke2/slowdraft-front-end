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
import Emoji from '../Emoji';

export default function Navbar({
  currentPick, setCurrentPick, picks, setPicks, draftingNow, setDraftingNow, userId, 
  sendChatAnnouncement, players, setPlayers, goalies, setGoalies,
  teams, setTeams, posts, setPosts, rules, setRules, user, getLatestData
}) {
  
  return (
    <>
      <Tabs defaultIndex={0} className="navbar-tabs">
        <TabList>
          <Tab><Emoji navbar={true} emoji='⚔️'  /><div>Draft</div></Tab>
          <Tab><Emoji navbar={true} emoji='⛸' /><div>Skaters</div></Tab>
          <Tab><Emoji navbar={true} emoji='🥅' /><div>Goalies</div></Tab>
          <Tab><Emoji navbar={true} emoji='🏒' /><div>Teams</div></Tab>
          <Tab><Emoji navbar={true} emoji='💬' /><div>Forum</div></Tab>
          <Tab><Emoji navbar={true} emoji='📖' /><div>Rules</div></Tab>
          <Tab><Emoji navbar={true} emoji='⛏️' /><div>Pick Tracker</div></Tab>
          { user.role === 'admin' && (
            <Tab><Emoji navbar={true} emoji='✨' /><div>Admin</div></Tab>
          )}
        </TabList>
        <TabPanel>
          <DraftTab 
            user={user}
            currentPick={currentPick}
            setCurrentPick={setCurrentPick}
            draftingNow={draftingNow}
            setDraftingNow={setDraftingNow}
            userId={userId}
            picks={picks}
            setPicks={setPicks}
            setTeams={setTeams}
            setPlayers={setPlayers}
            setGoalies={setGoalies}
            getLatestData={getLatestData}
            sendChatAnnouncement={sendChatAnnouncement}
          />
        </TabPanel>
        <TabPanel>
          <PlayersTab 
            user={user}
            setPicks={setPicks}
            setCurrentPick={setCurrentPick}
            draftingNow={draftingNow}
            setDraftingNow={setDraftingNow}
            sendChatAnnouncement={sendChatAnnouncement}
            players={players}
            setPlayers={setPlayers}
            setTeams={setTeams}
            getLatestData={getLatestData}
          />
        </TabPanel>
        <TabPanel>
          <GoaliesTab 
            user={user}
            setPicks={setPicks}
            setCurrentPick={setCurrentPick}
            draftingNow={draftingNow}
            setDraftingNow={setDraftingNow}
            sendChatAnnouncement={sendChatAnnouncement}
            goalies={goalies}
            setGoalies={setGoalies}
            setTeams={setTeams}
            getLatestData={getLatestData}
          />
        </TabPanel>
        <TabPanel>
          <TeamsTab 
            user={user}
            teams={teams}
            setTeams={setTeams}
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

