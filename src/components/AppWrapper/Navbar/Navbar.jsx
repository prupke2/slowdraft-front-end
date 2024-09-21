import React from "react";
import TeamsTab from "../Tabs/TeamsTab/TeamsTab";
import DraftTab from "../Tabs/DraftTab/DraftTab";
import RulesTab from "../Tabs/RulesTab/RulesTab";
import AdminTab from "../Tabs/AdminTab/AdminTab";
import WatchlistTab from "../Tabs/WatchlistTab/WatchlistTab";
import PickTrackerTab from "../Tabs/PickTrackerTab/PickTrackerTab";
import Emoji from "../Emoji";
import { Route, Switch, Redirect, NavLink } from "react-router-dom";
import "./Navbar.css";
import NewDraftTab from "../Tabs/AdminTab/NewDraftTab";
import PlayersTab from "../Tabs/PlayersTab/PlayersTab";
import ErrorBoundary from "../../ErrorBoundary/ErrorBoundary";
import NavHeader from "./NavHeader";
// import TradeTab from "../Tabs/TradeTab/TradeTab";

export default function Navbar({
  isRegisteredLeague,
  currentPick,
  setCurrentPick,
  picks,
  setPicks,
  draftingNow,
  setDraftingNow,
  getLatestData,
  useWideScreen,
  channel,
}) {

  const user = JSON.parse(localStorage.getItem("user"));
  const wideScreenStyling = useWideScreen ? "wide-screen" : undefined;

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
                <NavHeader emoji="⚔️" text="Draft" />
              </NavLink>
            </li>
            <li className="navtab">
              <NavLink to="/skaters" activeClassName="active">
                <NavHeader emoji="⛸" text="Skaters" />
              </NavLink>
            </li>
            <li className="navtab">
              <NavLink to="/goalies" activeClassName="active">
                <NavHeader emoji="🥅" text="Goalies" />
              </NavLink>
            </li>
            <li className="navtab">
              <NavLink to="/teams" activeClassName="active">
                <NavHeader emoji="🏒" text="Teams" />
              </NavLink>
            </li>
            <li className="navtab">
              <NavLink to="/watchlist" activeClassName="active">
                <NavHeader emoji="👀" text="Watchlist" />
              </NavLink>
            </li>
            {/* <li className="navtab">
              <NavLink to="/forum" activeClassName="active">
                <NavHeader emoji="✍🏼" text="Forum" />
              </NavLink>
            </li> */}
            <li className="navtab">
              <NavLink to="/rules" activeClassName="active">
                <NavHeader emoji="📖" text="Rules" />
              </NavLink>
            </li>
            <li className="navtab hide-small-width">
              <NavLink to="/pick-tracker" activeClassName="active">
                <NavHeader emoji="⛏️" text="Pick&nbsp;Tracker" />
              </NavLink>
            </li>
            {/* <li className="navtab hide-small-width">
              <NavLink to="/trade" activeClassName="active">
                <NavHeader emoji="🤝" text="Trade" />
              </NavLink>
            </li> */}
            {user?.role === "admin" && (
              <li className="navtab hide-small-width">
                <NavLink to="/admin" activeClassName="active">
                  <NavHeader emoji="✨" text="Admin" />
                </NavLink>
              </li>
            )}
          </>
        )}
      </ul>

      <div className={`tab-wrapper ${wideScreenStyling}`}>
        {!isRegisteredLeague && (
          <Switch>
            <Route path="/admin/new-draft">
              <ErrorBoundary>
                <NewDraftTab />
              </ErrorBoundary>
            </Route>
            <Redirect to="/admin/new-draft" />
          </Switch>
        )}
        {isRegisteredLeague && (
          <Switch>
            <Route path="/draft">
              <ErrorBoundary>
                <DraftTab
                  user={user}
                  currentPick={currentPick}
                  setCurrentPick={setCurrentPick}
                  picks={picks}
                  setPicks={setPicks}
                  draftingNow={draftingNow}
                  setDraftingNow={setDraftingNow}
                  getLatestData={getLatestData}
                  channel={channel}
                />
              </ErrorBoundary>
            </Route>
            <Route path="/skaters">
              <ErrorBoundary>
                <PlayersTab
                  playerType="skaters"
                  user={user}
                  draftingNow={draftingNow}
                  getLatestData={getLatestData}
                  channel={channel}
                />
              </ErrorBoundary>
            </Route>
            <Route path="/goalies">
              <ErrorBoundary>
                <PlayersTab
                  playerType="goalies"
                  user={user}
                  draftingNow={draftingNow}
                  getLatestData={getLatestData}
                  channel={channel}
                />
              </ErrorBoundary>
            </Route>
            <Route path="/teams">
              <ErrorBoundary>
                <TeamsTab
                  draftingNow={draftingNow}
                  getLatestData={getLatestData}
                />
              </ErrorBoundary>
            </Route>
            <Route path="/watchlist">
              <ErrorBoundary>
                <WatchlistTab
                  draftingNow={draftingNow}
                  channel={channel}
                />
              </ErrorBoundary>
            </Route>
            {/* <Route path="/forum">
              <ErrorBoundary>
                <ForumTab
                  getLatestData={getLatestData}
                />
              </ErrorBoundary>
            </Route> */}
            <Route path="/rules">
              <ErrorBoundary>
                <RulesTab
                  getLatestData={getLatestData}
                />
              </ErrorBoundary>
            </Route>
            <Route path="/pick-tracker">
              <ErrorBoundary>
                <PickTrackerTab />
              </ErrorBoundary>
            </Route>
            {/* <Route path="/trade">
              <ErrorBoundary>
                <TradeTab />
              </ErrorBoundary>
            </Route> */}
            {user?.role === "admin" && (
              <Route path="/admin">
                <ErrorBoundary>
                  <AdminTab 
                    channel={channel}
                  />
                </ErrorBoundary>
              </Route>
            )}
            <Redirect from="*" to="/draft" />
          </Switch>
        )}
      </div>
    </div>
  );
}
