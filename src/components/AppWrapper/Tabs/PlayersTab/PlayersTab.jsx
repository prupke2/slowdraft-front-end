import React, { useState, useEffect } from "react";
import {
  SearchColumnFilter,
  SelectPositionColumnFilter,
  SelectTeamFilter,
} from "../../../Table/FilterTypes/FilterTypes";
import Table from "../../../Table/Table";
import { getDBPlayers, getDBGoalies } from "../../../../util/requests";
import Loading from "../../../Loading/Loading";
import DraftModal from "../DraftTab/DraftModal";
import PlayerCell from "./PlayerCell";
import { skaterStatColumns, goalieStatColumns } from "./PlayerColumns";
import "./PlayersTab.css";

export default function PlayersTab({
  playerType,
  user,
  setGoalies,
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
  const [isLoading, setIsLoading] = useState(true);
  const [players, setPlayers] = useState([]);
  const [prospectDropdown, setProspectDropdown] = useState("all");
  const [availabilityDropdown, setAvailabilityDropdown] = useState("available");
  const [modalOpen, setModalOpen] = useState(false);
  const [playerToDraft, setPlayerToDraft] = useState("");
  const isLiveDraft = localStorage.getItem("liveDraft") === "true";

  function openDraftModal(player) {
    setModalOpen(true);
    setPlayerToDraft(player);
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

  const sharedColumns = [
    {
      Header: "Player",
      accessor: "name",
      Filter: SearchColumnFilter,
      sortType: "alphanumeric",
      width: "100px",
      Cell: (cell) => {
        const takenPlayer = cell.row.original.user !== null ? "taken-player" : null;
        return (
          <div className="player-wrapper">
            { draftingNow && (
              <div className="draft-button-cell">
                {!takenPlayer && isLiveDraft && (
                  <div>
                    <button onClick={() => openDraftModal(cell.row.original)}>
                      Draft
                    </button>
                    <DraftModal
                      modalIsOpen={modalOpen}
                      setIsOpen={setModalOpen}
                      data={playerToDraft}
                      modalType="draftPlayer"
                      sendChatAnnouncement={sendChatAnnouncement}
                      setPicks={setPicks}
                      currentPick={currentPick}
                      setCurrentPick={setCurrentPick}
                      setDraftingNow={setDraftingNow}
                      setPlayers={setPlayers}
                      setGoalies={setGoalies}
                      setTeams={setTeams}
                      channel={channel}
                    />
                  </div>
                )}
              </div>
            )}
            <PlayerCell 
              cell={cell} 
              draftingNow={draftingNow}
              showWatchlist
            />
          </div>
        );
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
              src={`/teamLogos/${row.value}.png`}
              alt={row.value}
              title={row.value}
            />
          )}
        </div>
      ),
    },
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

  const skaterColumns = [
    ...sharedColumns,
    {
      Header: "Pos",
      accessor: "position",
      Filter: SelectPositionColumnFilter,
      width: "30px",
    },
    ...skaterStatColumns,
  ];

  const goalieColumns = [
    ...sharedColumns,
    ...goalieStatColumns,
  ]

  const columns = playerType === "skaters" ? skaterColumns : goalieColumns;

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
    {
      id: "team",
      value: "",
    }
  ];

  const hiddenColumns = ["player_id", "player_key", "careerGP", "prospect", "user"];

  const skaterTableState = {
    hiddenColumns: hiddenColumns,
    sortBy: [
      {
        id: "3",
        desc: true,
      },
    ],
    filters,
  };
  
  const goalieTableState = {
    hiddenColumns: [...hiddenColumns, "position"],
    sortBy: [
      {
        id: "19",
        desc: true,
      },
    ],
    filters,
  };

  const tableState = playerType === "skaters" ? skaterTableState : goalieTableState;
  
  useEffect(() => {
    setIsLoading(true);
    getLatestData();
    const playerDBData = localStorage.getItem("playerDBData");
    const goalieDBData = localStorage.getItem("goalieDBData");

    if (playerType === "skaters") {
      if (playerDBData) {
        console.log("Using cached data");
        const data = JSON.parse(playerDBData);
        setPlayers(data);
        setIsLoading(false);
      } else {
        console.log("Getting new player DB data");
        getDBPlayers(setPlayers);
      }
    }
    if (playerType === "goalies") {
      if (goalieDBData) {
        console.log("Using cached data");
        const data = JSON.parse(goalieDBData);
        setPlayers(data);
        setIsLoading(false);
      } else {
        console.log("Getting new player DB data");
        getDBGoalies(setGoalies);
      }
    }
    setIsLoading(false);
  }, [setPlayers, setGoalies, getLatestData, playerType]);

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
            data={players || []}
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
