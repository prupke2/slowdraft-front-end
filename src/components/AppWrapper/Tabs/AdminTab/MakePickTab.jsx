import React, { useState } from "react";
import toast from "react-hot-toast";
import SelectPlayer from "./SelectPlayer";
import { getHeaders, teamIdToKey, teamsMap, API_URL, teamIdToTeamName } from "../../../../util/util";
import Emoji from "../../Emoji";
import { playerDraftedAnnouncement, publishToChat } from "../../Chat/ChatAnnouncements/ChatAnnouncements";
// import { playerDraftedAnnouncement } from "../../Chat/ChatAnnouncements/ChatAnnouncements";

export default function MakePickTab({ channel }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [teamId, setTeamId] = useState(user.yahoo_team_id);
  const [playerId, setPlayerId] = useState(null);
  const teams = JSON.parse(localStorage.getItem("teams"));
  const teamKey = teamIdToKey(teamId);
  localStorage.setItem("adminTab", "make-pick");

  function draftPlayer(e) {
    e.preventDefault();
    if (!playerId) {
      toast.error(`You forgot to select a player.`);
      return;
    }
    const requestParams = {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        team_key: teamKey,
        player_id: playerId,
      }),
    };
    fetch(`${API_URL}/make_pick`, requestParams)
      .then((response) => {
        if (!response.ok) {
          toast.error(`An error occurred. Please try again later.`);
          const error = response.status;
          return Promise.reject(error);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success === true) {
          const user = teamIdToTeamName(teamId);
          const player = data.player[0];
          const position = data.player[1];
          const team = data.player[2];
          toast.success(`👍 Success! Drafted ${player}, ${position} - ${team} for ${user}`);
          const msg = playerDraftedAnnouncement(user, player, position, team);
          publishToChat(channel, user, msg);
        } else {
          toast.error(
            `There was an error making this pick. ${
              data?.error ? data.error : null
            }`
          );
        }
      });
  }
  return (
    <form className="admin-form add-keeper-form">
      <div className="instructions make-pick-instructions ">
        <div className="warning">
          <Emoji emoji="⚠️" />
          This will draft a player for the selected team.
        </div>
        <div>It will also send out the "Next Pick" email.</div>
      </div>
      <div>
        <label name="admin-user-dropdown">Team:</label>
        <select
          className="admin-user-dropdown"
          onChange={(e) => setTeamId(e.target.value)}
          value={teamId}
        >
          {teamsMap(teams)}
        </select>
      </div>
      <SelectPlayer
        handleClick={draftPlayer}
        setPlayerId={setPlayerId}
      />
    </form>
  );
}
