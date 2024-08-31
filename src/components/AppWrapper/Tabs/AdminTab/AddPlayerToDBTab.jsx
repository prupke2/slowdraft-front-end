import React, { useState } from "react";
import toast from "react-hot-toast";
import { getHeaders, API_URL } from "../../../../util/util";
import Emoji from "../../Emoji";
import { SelectTeamFilter } from "../../../Table/FilterTypes/FilterTypes";

export default function AddPlayerToDBTab() {
  localStorage.setItem("adminTab", "add-player");
  const [name, setName] = useState(null);
  const [team, setTeam] = useState("");

  const [playerId, setPlayerId] = useState(null);
  const playerIdValid = !isNaN(parseInt(playerId), 10);

  const [positions, setPositions] = useState([]);
  const [positionsValid, setPositionsValid] = useState(false);

  const formComplete = name && team && playerIdValid && positionsValid;

  const handlePositionChange = (event) => {
    const newPosition = event.target.value;
    let newPositionsArray = positions;
    if (event.target.checked) {
      newPositionsArray.push(newPosition);
    } else {
      const index = newPositionsArray.indexOf(newPosition);
      newPositionsArray.splice(index, 1);
    }
    setPositions(newPositionsArray);
    setPositionsValid(newPositionsArray.length > 0);
  };

  const updateTimestamp = (positions) => {
    const fieldToUpdate = positions === ["G"] ? 'goalieDBUpdate' : 'playerDBUpdate';
    localStorage.setItem(fieldToUpdate, new Date());
  }

  function addPlayerToDb(e) {
    e.preventDefault();
    let requestParams = {
      method: "POST",
      headers: getHeaders(),
    };
    requestParams.body = JSON.stringify({
      name: name,
      player_id: playerId,
      team: team,
      positions: positions,
    });
    if (formComplete) {
      fetch(`${API_URL}/insert_player`, requestParams)
        .then((response) => {
          if (!response.ok) {
            const error = response.status;
            return Promise.reject(error);
          }
          return response.json();
        })
        .then((data) => {
          if (data.success === true) {
            setTimeout(function () {
              toast(`Player added successfully.`);
            }, 1000);
            updateTimestamp(positions);
          } else {
            toast(`Error adding player.`);
          }
        });
    } else {
      toast(`Please fill out all the fields.`);
    }
  }

  return (
    <form className="admin-form add-player-to-db">
      <div className="instructions flex-direction-column">
        <div>
          <Emoji emoji="⚠️" />
          This will add a player to the database.
        </div>
        <div className="warning">
          Before proceeding, make sure this player has a yahoo profile.
        </div>
        To make sure the player is not already in the database, search with the
        "All players" filter.
      </div>
      <div>
        <label htmlFor="name" name="name">
          Player name:
        </label>
        <input
          type="text"
          name="name"
          label="name"
          onChange={(e) => setName(e.target.value)}
          onBlur={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="yahooId" name="yahooId">
          Yahoo player id:
        </label>
        <input
          type="text"
          pattern="[0-9]"
          name="yahooId"
          label="yahooId"
          onChange={(e) => setPlayerId(e.target.value)}
          onBlur={(e) => setPlayerId(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="position">Positions: </label>
        <div className="positions">
          {["LW", "RW", "D", "C", "G"].map((position) => (
            <div key={position}>
              <input
                type="checkbox"
                value={position}
                name={position}
                id={position}
                onClick={(e) => handlePositionChange(e)}
              />
              <label htmlFor={position}>{position}</label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="team" name="team">
          Team:
        </label>
        <SelectTeamFilter
          name="team"
          label="team"
          column={{ filterValue: team, setFilter: (e) => setTeam(e) }}
          wideFilter
          disableAll
        />
      </div>
      <button
        className="add-player-button"
        onClick={(e) => addPlayerToDb(e)}
        disabled={!formComplete}
      >
        Add player
      </button>
    </form>
  );
}
