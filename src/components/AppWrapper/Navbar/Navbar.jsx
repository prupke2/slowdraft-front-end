import React from "react";
import PlayersTab from "../Tabs/PlayersTab/PlayersTab";
import TeamsTab from "../Tabs/TeamsTab/TeamsTab";
import ForumTab from "../Tabs/ForumTab/ForumTab";
import DraftTab from "../Tabs/DraftTab/DraftTab";
import RulesTab from "../Tabs/RulesTab/RulesTab";
import AdminTab from "../Tabs/AdminTab/AdminTab";
import PickTrackerTab from "../Tabs/PickTrackerTab/PickTrackerTab";
import Emoji from "../Emoji";
import { Route, Switch, Redirect, NavLink } from "react-router-dom";
import "./Navbar.css";
import NewDraftTab from "../Tabs/AdminTab/NewDraftTab";

export default function Navbar({
  isRegisteredLeague,
  currentPick,
  setCurrentPick,
  picks,
  setPicks,
  draftingNow,
  setDraftingNow,
  userId,
  sendChatAnnouncement,
  players,
  setPlayers,
  goalies,
  setGoalies,
  teams,
  setTeams,
  posts,
  setPosts,
  rules,
  setRules,
  user,
  getLatestData,
}) {

  return (
    <div className="navbar-tabs">
      <ul className="navtab-list">
        {!isRegisteredLeague && (
          <li className="navtab">
            <NavLink to="/admin/new-draft" activeClassName="active">
              <Emoji navbar={true} emoji="⚔️" />
              <div>Create draft</div>
            </NavLink>
          </li>
        )}
        {isRegisteredLeague && (
          <>
            <li className="navtab">
              <NavLink to="/draft" activeClassName="active">
                <Emoji navbar={true} emoji="⚔️" />
                <div>Draft</div>
              </NavLink>
            </li>
            <li className="navtab">
              <NavLink to="/skaters" activeClassName="active">
                <Emoji navbar={true} emoji="⛸" />
                <div>Skaters</div>
              </NavLink>
            </li>
            <li className="navtab">
              <NavLink to="/goalies" activeClassName="active">
                <Emoji navbar={true} emoji="🥅" />
                <div>Goalies</div>
              </NavLink>
            </li>
            <li className="navtab">
              <NavLink to="/teams" activeClassName="active">
                <Emoji navbar={true} emoji="🏒" />
                <div>Teams</div>
              </NavLink>
            </li>
            <li className="navtab">
              <NavLink to="/forum" activeClassName="active">
                <Emoji navbar={true} emoji="💬" />
                <div>Forum</div>
              </NavLink>
            </li>
            <li className="navtab">
              <NavLink to="/rules" activeClassName="active">
                <Emoji navbar={true} emoji="📖" />
                <div>Rules</div>
              </NavLink>
            </li>
            <li className="navtab hide-small-width">
              <NavLink to="/pick-tracker" activeClassName="active">
                <Emoji navbar={true} emoji="⛏️" />
                <div>Pick Tracker</div>
              </NavLink>
            </li>
            {user?.role === "admin" && (
              <li className="navtab hide-small-width">
                <NavLink to="/admin" activeClassName="active">
                  <Emoji navbar={true} emoji="✨" />
                  <div>Admin</div>
                </NavLink>
              </li>
            )}
          </>
        )}
      </ul>

      <div className="tab-wrapper">
        {!isRegisteredLeague && (
          <Switch>
            <Route path="/admin/new-draft">
              <NewDraftTab />
            </Route>
            <Redirect to="/admin/new-draft" />
          </Switch>
        )}
        {isRegisteredLeague && (
          <Switch>
            <Route path="/draft">
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
            </Route>
            <Route path="/skaters">
              <PlayersTab
                playerType="skaters"
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
            </Route>
            <Route path="/goalies">
              <PlayersTab
                playerType="goalies"
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
            </Route>
            <Route path="/teams">
              <TeamsTab
                user={user}
                draftingNow={draftingNow}
                teams={teams}
                setTeams={setTeams}
                getLatestData={getLatestData}
              />
            </Route>
            <Route path="/forum">
              <ForumTab
                user={user}
                posts={posts}
                setPosts={setPosts}
                getLatestData={getLatestData}
              />
            </Route>
            <Route path="/rules">
              <RulesTab
                user={user}
                rules={rules}
                setRules={setRules}
                getLatestData={getLatestData}
              />
            </Route>
            <Route path="/pick-tracker">
              <PickTrackerTab />
            </Route>
            {user?.role === "admin" && (
              <Route path="/admin">
                <AdminTab />
              </Route>
            )}
            <Redirect from="*" to="/draft" />
          </Switch>
        )}
      </div>
    </div>
  );
}
