import React from "react";
import "./LeagueSelector.css";
import Emoji from "../Emoji";
import { selectLeague } from "../../../util/requests";

export default function LeagueSelector({
  leagueList,
  setSingleLeagueSelected,
  logout,
  setIsLoading,
  setPicks,
  setCurrentPick,
  setDraftingNow,
}) {
  const fetchLeague = (leagueKey) => {
    setIsLoading(true);
    selectLeague(leagueKey, setPicks, setCurrentPick, setDraftingNow);
    setTimeout(() => {
      setSingleLeagueSelected(true);
    }, 2000);
    setIsLoading(false);
  };

  return (
    <>
      <div>
        <div className="blank-navbar">
          <span>
            <img
              className="logo-login"
              src="hockey_icon_large.png"
              alt=""
              title="SlowDraft"
            />
          </span>
          <button id="logout" onClick={logout}>
            Logout
          </button>
        </div>
        <div className="league-selector-wrapper">
          <div className="instructions league-selector-instructions">
            <p>
              You are in more than one Yahoo league. Please select the one you
              would like to login to with SlowDraft.
            </p>
            <p>
              Note: <Emoji emoji="✅" /> indicates that the league is already
              using SlowDraft.
            </p>
          </div>
          <ul className="league-selector">
            {leagueList.map((league) => {
              const registeredEmoji = league.registered ? "✅" : "❌";
              return (
                <li>
                  <button onClick={(e) => fetchLeague(league.league_key)}>
                    <div>
                      <Emoji emoji={registeredEmoji} />
                    </div>
                    <div className="league-name">{league.name}</div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
