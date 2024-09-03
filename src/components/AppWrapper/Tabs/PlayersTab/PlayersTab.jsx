import React, { useState, useEffect } from "react";
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

export default function PlayersTab({
  playerType,
  user,
  draftingNow,
  setTeams,
  getLatestData,
  sendChatAnnouncement,
  setPicks,
  setCurrentPick,
  setDraftingNow,
  currentPick,
  channel,
}) {
  const playersLocalStorage = JSON.parse(localStorage.getItem("playerDBData")) || [];

  const [isLoading, setIsLoading] = useState(true);
  const [players, setPlayers] = useState(playersLocalStorage || []);
  const skaters = players.filter(p => p?.position !== 'G');
  const goalies = players.filter(p => p?.position === 'G');
  const playerList = playerType === 'skaters' ? skaters : goalies;

  const [prospectDropdown, setProspectDropdown] = useState("all");
  const [availabilityDropdown, setAvailabilityDropdown] = useState("available");
  const [modalOpen, setModalOpen] = useState(false);
  const [playerDrafted, setPlayerDrafted] = useState("");
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

  function draftModal(player) {
    setModalOpen(true);
    setPlayerDrafted(player);
  }

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
                  <div>
                    <button onClick={() => draftModal(cell.row.original)}>
                      Draft
                    </button>
                    <DraftModal
                      modalIsOpen={modalOpen}
                      setIsOpen={setModalOpen}
                      data={playerDrafted}
                      modalType="draftPlayer"
                      sendChatAnnouncement={sendChatAnnouncement}
                      setPicks={setPicks}
                      currentPick={currentPick}
                      setCurrentPick={setCurrentPick}
                      setDraftingNow={setDraftingNow}
                      setPlayers={setPlayers}
                      setTeams={setTeams}
                      channel={channel}
                    />
                  </div>
                )}
              </div>
              <PlayerCell 
                cell={cell} 
                playerListPage={true}
                showWatchlist
              />
            </div>
          );
        } else {
          return (
            <PlayerCell 
              cell={cell} 
              playerListPage={true}
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

  const filters = [
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
  ];

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
          </div>
          <Table
            user={user}
            data={playerList || []}
            columns={columns}
            tableState={tableState}
            defaultColumn="name"
            tableType="draft"
            paginationTop
            paginationBottom
          />
        </>
      )}
    </>
  );
}
