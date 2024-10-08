import React, { useState } from "react";
import toast from "react-hot-toast";
import SelectPlayer from "./SelectPlayer";
import { getHeaders, teamIdToKey, teamsMap, API_URL } from "../../../../util/util";
import Emoji from "../../Emoji";

export default function AddKeeperTab({ singleTeam }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [keeperPlayerId, setKeeperPlayerId] = useState(null);
  const [teamId, setTeamId] = useState(user.yahoo_team_id);
  const [keeperList, setKeeperList] = useState([]);
  const teams = JSON.parse(localStorage.getItem("teams"));
  localStorage.setItem("adminTab", "add-keeper");

  function addKeeper(e) {
    e.preventDefault();
    const requestParams = {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        team_key: teamIdToKey(teamId),
        player_id: keeperPlayerId,
      }),
    };
    if (teamId && keeperPlayerId) {
      setKeeperList([...keeperList, [keeperPlayerId]]);
      fetch(`${API_URL}/add_keeper_player`, requestParams)
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
              toast.success("Keeper added successfully.");
            }, 500);
            setKeeperPlayerId(null);
          } else {
            setKeeperPlayerId([]);
            toast.error("Error adding keeper.");
          }
        });
    } else {
      toast.error("Please fill out all the fields.");
    }
  }

  return (
    <form className="admin-form add-keeper-form">
      {!singleTeam && (
        <>
          <div className="instructions">
            <div className="warning">
              <Emoji emoji="⚠️" />
              This will add the selected keeper for the selected team.
            </div>
          </div>
          <div>
            <label name="admin-user-dropdown">Team:</label>
            {}
            <select
              className="admin-user-dropdown"
              onChange={(e) => {
                setTeamId(e.target.value);
              }}
              value={teamId}
            >
              {teamsMap(teams)}
            </select>
          </div>
        </>
      )}
      <SelectPlayer handleClick={addKeeper} setPlayerId={setKeeperPlayerId} />
      {singleTeam && <div>{keeperList}</div>}
    </form>
  );
}
