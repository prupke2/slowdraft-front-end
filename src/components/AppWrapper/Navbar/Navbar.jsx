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
import TradeTab from "../Tabs/TradeTab/TradeTab";

export default function Navbar({
  isRegisteredLeague,
  currentPick,
  setCurrentPick,
  draftingNow,
  setDraftingNow,
  sendChatAnnouncement,
  getLatestData,
  ws,
}) {

  const user = JSON.parse(localStorage.getItem("user"));

  const chatMessage = JSON.stringify(
    {
      "user": user?.team_name,
      "color": user?.color, 
      "message": "Hello"
    }
  )

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
            <li className="navtab hide-small-width">
              <NavLink to="/trade" activeClassName="active">
                <Emoji navbar={true} emoji="🤝" />
                <div>Trade</div>
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
              <button onClick={() => ws.send(chatMessage)}>say hi</button>

              <DraftTab
                user={user}
                currentPick={currentPick}
                setCurrentPick={setCurrentPick}
                draftingNow={draftingNow}
                setDraftingNow={setDraftingNow}
                getLatestData={getLatestData}
                sendChatAnnouncement={sendChatAnnouncement}
              />
            </Route>
            <Route path="/skaters">
              <PlayersTab
                playerType="skaters"
                user={user}
                setCurrentPick={setCurrentPick}
                draftingNow={draftingNow}
                setDraftingNow={setDraftingNow}
                sendChatAnnouncement={sendChatAnnouncement}
                getLatestData={getLatestData}
                currentPick={currentPick}
              />
            </Route>
            <Route path="/goalies">
              <PlayersTab
                playerType="goalies"
                user={user}
                setCurrentPick={setCurrentPick}
                draftingNow={draftingNow}
                setDraftingNow={setDraftingNow}
                sendChatAnnouncement={sendChatAnnouncement}
                getLatestData={getLatestData}
                currentPick={currentPick}
              />
            </Route>
            <Route path="/teams">
              <TeamsTab
                draftingNow={draftingNow}
                getLatestData={getLatestData}
              />
            </Route>
            <Route path="/forum">
              <ForumTab
                // user={user}
                // posts={posts}
                // setPosts={setPosts}
                getLatestData={getLatestData}
              />
            </Route>
            <Route path="/rules">
              <RulesTab
                // user={user}
                // rules={rules}
                // setRules={setRules}
                getLatestData={getLatestData}
              />
            </Route>
            <Route path="/pick-tracker">
              <PickTrackerTab />
            </Route>
            <Route path="/trade">
              <TradeTab />
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
