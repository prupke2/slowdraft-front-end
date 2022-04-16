import React, { useEffect, useState } from "react";
import Loading from "../../../Loading/Loading";
import Table from "../../../Table/Table";
import { getTeams } from "../../../../util/requests";
import { teamIdToLogo, teamsMap } from "../../../../util/util";
import "./TeamsTab.css";
import PlayerCell from "../PlayersTab/PlayerCell";
import { useLocation } from "react-router-dom";

export default function TeamTab({
  user,
  draftingNow,
  setTeams,
  getLatestData,
}) {
  const teams = JSON.parse(localStorage.getItem("playerTeamData"));
  const teamInfo = JSON.parse(localStorage.getItem("teams"));
  // const [teamInfo, setTeamInfo] = useState([]);
  const [teamFilter, setTeamFilter] = useState(user?.team_name);
  const location = useLocation();
  const teamIdParam = parseInt(location?.state?.teamId, 10) || null;
  const [teamId, setTeamId] = useState(null);
  const [teamPlayerCount, setTeamPlayerCount] = useState(
    teams.filter((team) => team.username === teamFilter).length
  );

  useEffect(() => {
    if (teamIdParam) {
      const selectedTeam = teamIdParam
        ? teamInfo.filter((team) => team.yahoo_team_id === teamIdParam)
        : null;

      if (selectedTeam) {
        setTeamFilter(selectedTeam[0]?.team_name);
      }
    }
  }, [teamIdParam, teamInfo]);

  useEffect(() => {
    setIsLoading(true);
    // setTimeout(function () {}, 1500) // set a delay so that the localStorage is available
    // const teamInfo = JSON.parse(localStorage.getItem('teams'));
    // if (teamInfo) {
    //   console.log("setting team info");
    //   setTeamInfo(teamInfo);
    // }
    getLatestData();
    if (teams && user) {
      console.log("Using cached data");
      setTeams(teams.teams);
    } else {
      console.log("Getting new team data");
      if (user) {
        getTeams(setTeams);
      }
    }
    setIsLoading(false);
    setTeamId(teamIdParam || user?.yahoo_team_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function multiSelectPositionsFilter(rows) {
    return rows.filter((row) => row.original.position !== "G");
  }

  useEffect(() => {
    const teamPlayerCount = teams.filter(
      (team) => team.username === teamFilter
    ).length;
    setTeamPlayerCount(parseInt(teamPlayerCount, 10));
  }, [teamFilter, teams]);

  const playerColumns = [
    {
      Header: "Overall Pick",
      accessor: "overall_pick",
      disableFilters: true,
      Cell: (cell) => cell.value || "-",
      width: "20px",
    },
    {
      Header: "Player",
      accessor: "name",
      disableFilters: true,
      disableSortBy: true,
      Cell: (cell) => <PlayerCell cell={cell} draftingNow={draftingNow} />,
    },
    {
      Header: "Team",
      accessor: "team",
      width: "50px",
      disableFilters: true,
      disableSortBy: true,
      Cell: (cell) => (
        <div className="team-logo-container">
          {cell.value && (
            <img
              className="teamLogo"
              src={`/teamLogos/${cell.value}.png`}
              alt={cell.value}
              title={cell.value}
            />
          )}
        </div>
      ),
    },
    {
      Header: "Pos",
      accessor: "position",
      width: "30px",
      filter: multiSelectPositionsFilter,
      disableFilters: true,
      disableSortBy: true,
    },
    {
      Header: "GP",
      accessor: "0",
      disableFilters: true,
      width: "30px",
      sortDescFirst: true,
    },
    {
      Header: "G",
      accessor: "1",
      disableFilters: true,
      width: "30px",
      sortDescFirst: true,
    },
    {
      Header: "A",
      accessor: "2",
      disableFilters: true,
      width: "30px",
      sortDescFirst: true,
    },
    {
      Header: "P",
      accessor: "3",
      disableFilters: true,
      width: "30px",
      sortDescFirst: true,
    },
    {
      Header: "+/-",
      accessor: "4",
      disableFilters: true,
      width: "30px",
      sortDescFirst: true,
    },
    {
      Header: "PIM",
      accessor: "5",
      disableFilters: true,
      width: "30px",
      sortDescFirst: true,
    },
    {
      Header: "PPP",
      accessor: "8",
      disableFilters: true,
      width: "30px",
      sortDescFirst: true,
    },
    {
      Header: "SOG",
      accessor: "14",
      disableFilters: true,
      width: "30px",
      sortDescFirst: true,
    },
    {
      Header: "S%",
      accessor: "15",
      disableFilters: true,
      width: "30px",
      sortDescFirst: true,
    },
    {
      Header: "FW",
      accessor: "16",
      disableFilters: true,
      width: "30px",
      sortDescFirst: true,
    },
    {
      Header: "HIT",
      accessor: "31",
      disableFilters: true,
      width: "30px",
      sortDescFirst: true,
    },
    {
      Header: "BLK",
      accessor: "32",
      disableFilters: true,
      width: "30px",
      sortDescFirst: true,
    },
    {
      accessor: "username",
    },
    {
      accessor: "player_id",
    },
    {
      accessor: "is_keeper",
    },
    {
      accessor: "prospect",
    },
  ];

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

  const goalieColumns = [
    {
      Header: "Overall Pick",
      accessor: "overall_pick",
      Cell: (cell) => cell.value || "-",
      disableFilters: true,
      width: "20px",
    },
    {
      Header: "Player",
      accessor: "name",
      disableFilters: true,
      disableSortBy: true,
      Cell: (cell) => <PlayerCell cell={cell} draftingNow={draftingNow} />,
    },
    {
      Header: "Team",
      accessor: "team",
      width: "50px",
      disableFilters: true,
      disableSortBy: true,
      Cell: (cell) => (
        <div className="team-logo-container">
          {cell.value && (
            <img
              className="teamLogo"
              src={`/teamLogos/${cell.value}.png`}
              alt={cell.value}
              title={cell.value}
            />
          )}
        </div>
      ),
    },
    {
      Header: "GS",
      accessor: "18",
      disableFilters: true,
      sortType: "alphanumeric",
      width: "30px",
      sortDescFirst: true,
    },
    {
      Header: "W",
      accessor: "19",
      disableFilters: true,
      sortType: "alphanumeric",
      width: "30px",
      sortDescFirst: true,
    },
    {
      Header: "GAA",
      accessor: "23",
      disableFilters: true,
      width: "30px",
      sortType: "alphanumeric",
    },
    {
      Header: "SV",
      accessor: "25",
      disableFilters: true,
      sortType: "alphanumeric",
      width: "30px",
      sortDescFirst: true,
    },
    {
      Header: "SV%",
      accessor: "26",
      disableFilters: true,
      sortType: "alphanumeric",
      width: "30px",
      sortDescFirst: true,
    },
    {
      accessor: "username",
    },
    {
      accessor: "position",
    },
    {
      accessor: "player_id",
    },
    {
      accessor: "is_keeper",
    },
    {
      accessor: "prospect",
    },
  ];

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

  const [isLoading, setIsLoading] = useState(true);

  function handleTeamFilterChange(e) {
    setTeamId(e.target.value);
    const teamSelectFilter = document.getElementById("team-filter-select");
    const teamName =
      teamSelectFilter.options[teamSelectFilter.selectedIndex].text;
    setTeamFilter(teamName);
  }

  if (isLoading) {
    return <Loading text="Loading teams..." />;
  }
  if (!isLoading) {
    return (
      <>
        <div className="team-tab-header">
          <div className="team-and-logo-wrapper">
            <img
              className="logo-teams-page"
              src={teamIdToLogo(teamId)}
              alt="logo"
            />
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
        {teams && (
          <>
            <h2>Skaters</h2>
            <Table
              user={user}
              data={teams}
              columns={playerColumns}
              tableState={playerTableState}
              defaultColumn="player_id"
              draftingNow={draftingNow}
              tableType="teams"
            />
            <h2>Goalies</h2>
            <Table
              user={user}
              data={teams}
              columns={goalieColumns}
              tableState={goalieTableState}
              defaultColumn="player_id"
              draftingNow={draftingNow}
              tableType="teams"
            />
          </>
        )}
      </>
    );
  }
}
