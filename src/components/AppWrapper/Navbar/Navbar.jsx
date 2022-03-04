import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import PlayersTab from '../Tabs/PlayersTab/PlayersTab';
import TeamsTab from '../Tabs/TeamsTab/TeamsTab';
import ForumTab from '../Tabs/ForumTab/ForumTab';
import DraftTab from '../Tabs/DraftTab/DraftTab';
import RulesTab from '../Tabs/RulesTab/RulesTab';
import AdminTab from '../Tabs/AdminTab/AdminTab';
import PickTrackerTab from '../Tabs/PickTrackerTab/PickTrackerTab';
import Emoji from '../Emoji';
import { updateUrlPath } from '../../../../src/util/util';
import { useLocation } from "react-router-dom";
import './Navbar.css';

export default function Navbar({
  currentPick, setCurrentPick, picks, setPicks, draftingNow, setDraftingNow, userId, 
  sendChatAnnouncement, players, setPlayers, goalies, setGoalies,
  teams, setTeams, posts, setPosts, rules, setRules, user, getLatestData
}) {
  const pathToIndexMap = {
    '/draft': 0,
    '/skaters': 1,
    '/goalies': 2,
    '/teams': 3,
    '/forum': 4,
    '/rules': 5,
    '/pick-tracker': 6,
    '/admin': 7
  }
  const location = useLocation();
  const defaultIndex = pathToIndexMap[location.pathname] || '0';
  const [updateTab, setUpdateTab] = useState(null);

  useEffect(() => {
    if (updateTab) {
      const pathWithoutParams = updateTab.match(/^[^?]*/);
      const tab = pathToIndexMap[`/${pathWithoutParams}`];
      const tabId = `react-tabs-${tab * 2}`; // x2 because react-tabs uses an extra hidden tab for each for a11y purposes

      document.getElementById(tabId).click();
      updateUrlPath(updateTab);
      setUpdateTab(null);
    }
  }, [updateTab, pathToIndexMap])

  return (
    <>
      <Tabs defaultIndex={defaultIndex} className="navbar-tabs">
        <TabList>
          <Tab onClick={() => updateUrlPath('draft')}>
            <Emoji navbar={true} emoji='⚔️'  />
            <div>Draft</div>
          </Tab>
          <Tab onClick={() => updateUrlPath('skaters')}>
            <Emoji navbar={true} emoji='⛸' />
            <div >Skaters</div>
          </Tab>
          <Tab onClick={() => updateUrlPath('goalies')}>
            <Emoji navbar={true} emoji='🥅' />
            <div >Goalies</div>
          </Tab>
          <Tab onClick={() => updateUrlPath('teams')}>
            <Emoji navbar={true} emoji='🏒' />
            <div>Teams</div>
          </Tab>
          <Tab onClick={() => updateUrlPath('forum')}>
            <Emoji navbar={true} emoji='💬' />
            <div>Forum</div>
          </Tab>
          <Tab onClick={() => updateUrlPath('rules')}>
            <Emoji navbar={true} emoji='📖' />
            <div>Rules</div>
          </Tab>
          <Tab onClick={() => updateUrlPath('pick-tracker')}>
            <Emoji navbar={true} emoji='⛏️' />
            <div>Pick Tracker</div>
          </Tab>
          { user.role === 'admin' && (
            <Tab onClick={() => updateUrlPath('admin')}>
              <Emoji navbar={true} emoji='✨' />
              <div>Admin</div>
            </Tab>
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
            setUpdateTab={setUpdateTab}
          />
        </TabPanel>
        <TabPanel>
          <PlayersTab
            playerType='skaters'
            user={user}
            setPicks={setPicks}
            setCurrentPick={setCurrentPick}
            draftingNow={draftingNow}
            setDraftingNow={setDraftingNow}
            sendChatAnnouncement={sendChatAnnouncement}
            players={players}
            setPlayers={setPlayers}
            setGoalies={setGoalies}
            setTeams={setTeams}
            getLatestData={getLatestData}
            currentPick={currentPick}
          />
        </TabPanel>
        <TabPanel>
          <PlayersTab
            playerType='goalies'
            user={user}
            setPicks={setPicks}
            setCurrentPick={setCurrentPick}
            draftingNow={draftingNow}
            setDraftingNow={setDraftingNow}
            sendChatAnnouncement={sendChatAnnouncement}
            players={goalies}
            setPlayers={setPlayers}
            setGoalies={setGoalies}
            setTeams={setTeams}
            getLatestData={getLatestData}
            currentPick={currentPick}
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
            setUpdateTab={setUpdateTab}
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

