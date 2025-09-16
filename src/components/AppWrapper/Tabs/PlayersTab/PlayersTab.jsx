import React, { useState, useEffect, useMemo } from "react";
import {
  SearchColumnFilter,
  SelectTeamFilter,
} from "../../../Table/FilterTypes/FilterTypes";
import Table from "../../../Table/Table";
import { getDBPlayers } from "../../../../util/requests";
import Loading from "../../../Loading/Loading";
import DraftModal from "../DraftTab/DraftModal";
import PlayerCell from "./PlayerCell";
import { playersTabSkaterColumns, playersTabGoalieColumns } from "./PlayerColumns";
import teamLogos from "../../../../util/teamLogos";
import "./PlayersTab.css";
import Emoji from "../../Emoji";

export default function PlayersTab({
  playerType,
  user,
  draftingNow,
  getLatestData,
  channel,
}) {
  const playersLocalStorage = JSON.parse(localStorage.getItem("playerDBData")) || [];
    // Add a state to trigger re-renders
  const [filterResetKey, setFilterResetKey] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [players, setPlayers] = useState(playersLocalStorage || []);

  // These caches are set in their respective filter components in FilterTypes.jsx
  const teamFilterCache = localStorage.getItem("team-filter-cache") || 'all';
  const positionFilterCache = localStorage.getItem("position-filter-cache") || 'all';

  // These caches are set in the useEffect hooks below
  const prospectFilterCache = localStorage.getItem("prospect-filter-cache");
  const availabilityFilterCache = localStorage.getItem("availability-filter-cache");

  const [prospectDropdown, setProspectDropdown] = useState(prospectFilterCache || 'all');
  const [availabilityDropdown, setAvailabilityDropdown] = useState(availabilityFilterCache || 'available');

  const skaters = players.filter(p => p?.position !== 'G');
  const goalies = players.filter(p => p?.position === 'G');
  const playerList = playerType === 'skaters' ? skaters : goalies;

  const isLiveDraft = localStorage.getItem("liveDraft") === "true";

  useEffect(() => {
    setIsLoading(true);
    getLatestData();
    const playerDBData = localStorage.getItem("playerDBData");

    if (playerDBData) {
      console.log("Using cached data");
      const data = JSON.parse(playerDBData);
      setPlayers(data);
      setIsLoading(false);
    } else {
      console.log("Getting new player DB data");
      getDBPlayers(setPlayers);
    }
    setIsLoading(false);
  }, [setPlayers, getLatestData, playerType]);

  useEffect(() => {
    localStorage.setItem("prospect-filter-cache", prospectDropdown);
  }, [prospectDropdown]);

  useEffect(() => {
    localStorage.setItem("availability-filter-cache", availabilityDropdown);
  }, [availabilityDropdown]);

  function prospectFilter(rows) {
    if (prospectDropdown === "all") {
      return rows;
    }
    return rows.filter(row => String(row.original.prospect) === prospectDropdown);
  }

  function availabilityFilter(rows) {
    if (availabilityDropdown === "all") {
      return rows;
    }
    return rows.filter((row) => row.original.user === null);
  }

  const statColumns =
    playerType === "skaters" ? playersTabSkaterColumns : playersTabGoalieColumns;

  const columns = [
    {
      Header: "Player",
      accessor: "name",
      Filter: SearchColumnFilter,
      sortType: "alphanumeric",
      width: "100px",
      Cell: (cell) => {
        const takenPlayer =
          cell.row.original.user !== null ? "taken-player" : null;
        if (draftingNow === true) {
          return (
            <div className="player-wrapper">
              <div className="draft-button-cell">
                {!takenPlayer && isLiveDraft && (
                  <DraftModal
                    player={cell.row.original}
                    channel={channel}
                  />
                )}
              </div>
              <PlayerCell 
                cell={cell} 
                showWatchlist
              />
            </div>
          );
        } else {
          return (
            <PlayerCell 
              cell={cell} 
              showWatchlist
            />
          );
        }
      },
    },
    {
      Header: "Team",
      accessor: "team",
      Filter: SelectTeamFilter,
      width: "50px",
      Cell: (row) => (
        <div className="team-logo-container">
          {row.value && (
            <img
              className="teamLogo"
              src={`${teamLogos[row.value]}`}
              alt={row.value}
              title={row.value}
            />
          )}
        </div>
      ),
    },
    ...statColumns,
    {
      accessor: "careerGP",
    },
    {
      accessor: "player_id",
    },
    {
      accessor: "player_key",
    },
    {
      accessor: "prospect",
      filter: prospectFilter,
    },
    {
      accessor: "user",
      filter: availabilityFilter,
    },
  ];

  const filters = useMemo(() => [
    {
      id: "userColumn",
      value: "null",
    },
    {
      id: "prospect",
    },
    {
      id: "user",
    },
    teamFilterCache !== 'all' && {
      id: "team",
      value: teamFilterCache,
    },
    playerType === 'skaters' && positionFilterCache !== 'all' && {
      id: "position",
      value: positionFilterCache,
    },
  ], [teamFilterCache, positionFilterCache, playerType]);

  const goalieTableState = {
    hiddenColumns: [
      "position",
      "player_id",
      "player_key",
      "careerGP",
      "prospect",
      "user",
    ],
    sortBy: [
      {
        id: "19",
        desc: true,
      },
    ],
    filters: filters,
  };

  const skaterTableState = {
    hiddenColumns: ["player_id", "player_key", "careerGP", "prospect", "user"],
    sortBy: [
      {
        id: "3",
        desc: true,
      },
    ],
    filters: filters,
  };

  const tableState =
    playerType === "skaters" ? skaterTableState : goalieTableState;
  
  useEffect(() => {
    setIsLoading(true);
    getLatestData();
    setIsLoading(false);
  }, [setPlayers, getLatestData, playerType]);

  function handleClearFilters() {
    localStorage.removeItem("team-filter-cache");
    localStorage.removeItem("position-filter-cache");
    localStorage.removeItem("prospect-filter-cache");
    localStorage.removeItem("availability-filter-cache");

    setProspectDropdown('all');
    setAvailabilityDropdown('available');
    // Force table to re-render with fresh state
    setFilterResetKey(prev => prev + 1);
  }

  return (
    <>
      {isLoading && <Loading text="Loading players..." />}
      {!isLoading && (
        <>
          <div className="player-tabs-filter-wrapper">
            <div className="player-type-wrapper">
              <label>Player type: </label>
              <select
                id="prospect-filter-select"
                value={prospectDropdown}
                className="change-user-dropdown"
                onChange={(e) => {
                  setProspectDropdown(e.target.value || undefined);
                }}
              >
                <option value={"all"}>All</option>
                <option value={"0"}>Non-prospects</option>
                <option value={"1"}>Prospects</option>
              </select>
            </div>
            <div>
              <label>Availability: </label>
              <select
                value={availabilityDropdown}
                onChange={(e) => {
                  setAvailabilityDropdown(e.target.value || undefined);
                }}
              >
                <option value="available">All available {playerType}</option>
                <option value="all">All {playerType}</option>
              </select>
            </div>
            <div>
              <button
                onClick={handleClearFilters}  
                className="small-button clear-filters-button"
              >
                <div><Emoji emoji="✖️" />&nbsp;</div>
                <div>Clear filters</div>
              </button>
            </div>
          </div>
          <Table
            key={`players-table-${playerType}-${filterResetKey}`}
            user={user}
            data={playerList || []}
            columns={columns}
            tableState={tableState}
            tableType={playerType}
            defaultColumn="name"
            paginationTop
            paginationBottom
          />
        </>
      )}
    </>
  );
}
