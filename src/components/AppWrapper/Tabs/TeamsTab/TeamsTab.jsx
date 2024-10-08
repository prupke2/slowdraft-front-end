import React, { useEffect, useState } from "react";
import Loading from "../../../Loading/Loading";
import Table from "../../../Table/Table";
import { getTeams } from "../../../../util/requests";
import { teamIdToLogo, teamIdToTeamName, teamsMap } from "../../../../util/util";
import "./TeamsTab.css";
import { useLocation } from "react-router-dom";
import { teamsTabSkaterColumns, teamsTabGoalieColumns } from "../PlayersTab/PlayerColumns";

export default function TeamTab({
  draftingNow,
}) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [teams, setTeams] = useState([]);
  const teamInfo = JSON.parse(localStorage.getItem("teams"));
  const [teamFilter, setTeamFilter] = useState(user?.team_name);
  const location = useLocation();
  const teamIdParam = parseInt(location?.state?.teamId, 10) || null;
  const [teamId, setTeamId] = useState(null);
  const displayedTeam = teams.filter(team => team.username === teamFilter);
  const [teamPlayerCount, setTeamPlayerCount] = useState(displayedTeam.length);
  const teamHasGoalies = displayedTeam.filter(p => p.position === "G").length > 0;
  const teamHasSkaters = displayedTeam.filter(p => p.position !== "G").length > 0;

  const [paramUsed, setParamUsed] = useState(false);
  const currentTeamName = teamIdToTeamName(teamId);

  useEffect(() => {
    const localStorageTeams = JSON.parse(localStorage.getItem('teams'));
    // This accomodates clicking on a team name link from another tab.
    // This updates the team filter and scrolls to the top of the page
    if (teamIdParam) {
      const selectedTeam = teamIdParam
        ? localStorageTeams.filter((team) => team.yahoo_team_id === teamIdParam)
        : null;

      if (selectedTeam) {
        setTeamFilter(selectedTeam[0]?.team_name);
        setParamUsed(true);
        const mainWindow = document.querySelector("main");
        mainWindow.scrollTop = 0;
      }
    }    
  }, [teamIdParam, teamInfo, paramUsed, location]);

  useEffect(() => {
    setIsLoading(true);
    const localStorageTeams = JSON.parse(localStorage.getItem('playerTeamData'));
    if (localStorageTeams) {
      setTeams(localStorageTeams);
    } else {
      getTeams();
    }
    setTeamId(teamIdParam || user?.yahoo_team_id);
    setIsLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTeams, location]);

  useEffect(() => {
    const localStorageTeams = JSON.parse(localStorage.getItem('playerTeamData'));
    if (localStorageTeams) {
      setTeams(localStorageTeams);
    }
  }, [teamFilter, location]);

  useEffect(() => {
    const teamPlayerCount = teams.filter(
      (team) => team.username === teamFilter
    ).length;
    setTeamPlayerCount(parseInt(teamPlayerCount, 10));
  }, [teamFilter, teams, location]);

  const [isLoading, setIsLoading] = useState(true);

  function handleTeamFilterChange(e) {
    setTeamId(e.target.value);
    const teamSelectFilter = document.getElementById("team-filter-select");
    const teamName =
      teamSelectFilter.options[teamSelectFilter.selectedIndex].text;
    setTeamFilter(teamName);
    if (teamIdParam) {
      location.state.teamId = `${e.target.value}`;
    }
  }

  const playerTableState = {
    hiddenColumns: ["player_id", "is_keeper", "prospect", "username"],
    sortBy: [
      {
        id: "overall_pick",
        desc: false,
      },
    ],
    filters: [
      {
        id: "username",
        value: teamFilter,
      },
      {
        id: "position",
        // no value needed here - this filtering is done in the column definition (filter: multiSelectPositionsFilter)
      },
    ],
  };

  const goalieTableState = {
    hiddenColumns: [
      "player_id",
      "position",
      "is_keeper",
      "prospect",
      "username",
    ],
    sortBy: [
      {
        id: "overall_pick",
        desc: false,
      },
    ],
    filters: [
      {
        id: "username",
        value: teamFilter,
      },
      {
        id: "position",
        value: "G",
      },
    ],
  };


  if (isLoading) {
    return <Loading text="Loading teams..." />;
  }
  if (!isLoading) {
    return (
      <>
        <div className="team-tab-header">
          <div className="team-and-logo-wrapper">
            <div>
              <img
                className="logo-teams-page"
                src={teamIdToLogo(teamId)}
                alt="logo"
              />
            </div>
            <div className="team-filter-wrapper">
              <select
                id="team-filter-select"
                value={teamId}
                className="change-user-dropdown"
                onChange={(e) => handleTeamFilterChange(e)}
              >
                {teamsMap(teamInfo)}
              </select>
            </div>
          </div>
          <div className="player-count">
            <div>
              Total: <span>{teamPlayerCount}</span>
            </div>
            <div>
              Remaining: <span>{24 - teamPlayerCount}</span>
            </div>
          </div>
        </div>
        {displayedTeam.length === 0 && <div className="empty-verbiage full-margin-bottom">The {currentTeamName} have no players yet.</div>}
        {displayedTeam.length > 0 && (
          <>
            <h2>Skaters</h2>
            { !teamHasSkaters && <div className="empty-verbiage">The {currentTeamName} have no skaters yet.</div>}
            { teamHasSkaters && (
              <Table
                user={user}
                data={teams}
                columns={teamsTabSkaterColumns}
                tableState={playerTableState}
                defaultColumn="player_id"
                draftingNow={draftingNow}
                tableType="teams"
              />
            )}
            <h2>Goalies</h2>
            { !teamHasGoalies && <div className="empty-verbiage">The {currentTeamName} have no goalies yet.</div>}
            { teamHasGoalies && (
              <Table
                user={user}
                data={teams}
                columns={teamsTabGoalieColumns}
                tableState={goalieTableState}
                defaultColumn="player_id"
                draftingNow={draftingNow}
                tableType="teams"
              />
            )}
          </>
        )}
      </>
    );
  }
}
