import React, { useState } from "react";
import { SearchColumnFilter } from "../../../Table/FilterTypes/FilterTypes";
import Table from "../../../Table/Table";
import "./AdminTab.css";

export default function SelectPlayer({ handleClick, setPlayerId }) {
  const [player, setPlayer] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const playerDBData = JSON.parse(localStorage.getItem("playerDBData"));
  const goalieDBData = JSON.parse(localStorage.getItem("goalieDBData"));
  const data = playerDBData.players.concat(goalieDBData.players);
  const dropdownState = player ? "closed" : "open";
  const button = player ? `Select ${player.name}` : null;

  const columns = [
    {
      Header: "",
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
        value: "null",
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
    setTimeout(() => {
      filter.value = cell.name;
      filter.disabled = true;
    }, 300);
    setPlayer(cell);
    setPlayerId(cell.player_id);
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
            data={data}
            columns={columns}
            tableState={tableState}
            defaultColumn="name"
            tableType="singlePlayer"
          />
        </div>
        <button className="clear-button" onClick={(e) => clearPlayer(e)}>
          Clear
        </button>
      </div>
      {button && (
        <button onClick={(e) => handleClick(e)} className="add-player-button">
          Select {player.name}
        </button>
      )}
    </>
  );
}
