import React, { useState } from "react";
import { SearchColumnFilter } from "../../../Table/FilterTypes/FilterTypes";
import Table from "../../../Table/Table";
import "./AdminTab.css";
import Emoji from "../../Emoji";

export default function SelectPlayer({ handleClick, setPlayerId }) {
  const [player, setPlayer] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const playerDBData = JSON.parse(localStorage.getItem("playerDBData"));
  const dropdownState = player ? "closed" : "open";
  const button = player ? `Select ${player.name}` : null;

  const columns = [
    {
      Header: null,
      accessor: "name",
      Filter: SearchColumnFilter,
      sortType: "alphanumeric",
      Cell: (cell) => (
        <div
          className="single-player"
          onClick={() => playerNameOnClick(cell.row.original) || null}
        >
          {cell.value}, {cell.row.original.position} - {cell.row.original.team}
        </div>
      ),
      width: "100px",
    },
    {
      accessor: "team",
    },
    {
      accessor: "position",
    },
    {
      accessor: "player_id",
    },
    {
      accessor: "user",
    },
  ];

  const tableState = {
    hiddenColumns: ["team", "position", "player_id", "player_key", "user"],
    filters: [
      {
        id: "user",
        value: null,
      },
    ],
    sortBy: [
      {
        id: "name",
        desc: false,
      },
    ],
  };

  function clearPlayer(e) {
    const filter = document.getElementById("name-search-filter");
    e.preventDefault();
    setPlayerId(null);
    setPlayer(null);
    filter.disabled = false;
    filter.value = null;
  }

  function playerNameOnClick(cell) {
    const filter = document.getElementById("name-search-filter");

    // Scroll table to top immediately
    const tableContainer = document.querySelector('.player-list-wrapper');
    if (tableContainer) {
      tableContainer.scrollTop = 0;
    }
    
    setTimeout(() => {
      filter.value = cell.name;
      filter.disabled = true;
    }, 100);
    setPlayer(cell);
    setPlayerId(cell.player_id);
  }

  function selectPlayerHandler(e) {
    handleClick(e);
    clearPlayer(e);
  }

  return (
    <>
      <div>
        <label className="player-label" name="player">
          Player:
        </label>
        <div className={`player-list-wrapper ${dropdownState}`}>
          <Table
            user={user}
            data={playerDBData}
            columns={columns}
            tableState={tableState}
            defaultColumn="name"
            tableType="singlePlayer"
          />
        </div>
        <div className="clear-selected-player-wrapper">
          {dropdownState === "closed" && (
            <button
              className="close-modal clear-selected-player-wrapper"
              onClick={clearPlayer}
            >
              <Emoji emoji="✖️" />
            </button>
          )}
        </div>
      </div>
      {button && (
        <button onClick={selectPlayerHandler} className="clear-button add-player-button">
          <Emoji emoji="✅" />&nbsp;Select {player.name}
        </button>
      )}
    </>
  );
}
