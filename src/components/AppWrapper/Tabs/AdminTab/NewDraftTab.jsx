import React, { useState } from "react";
import toast from "react-hot-toast";
import { getHeaders, API_URL } from "../../../../util/util";
import Emoji from "../../Emoji";

export default function NewDraftTab() {
  const teams = JSON.parse(localStorage.getItem("teams"));
  const [rounds, setRounds] = useState(14);
  // const [snakeDraft, setSnakeDraft] = useState(false);
  const isRegisteredLeague =
    localStorage.getItem("registeredLeague") === "true";
  localStorage.setItem("adminTab", "new-draft");

  function createNewDraft(e) {
    e.preventDefault();
    const teamOrderList = getTeamOrder();
    const requestParams = {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        rounds: rounds,
        // snake: snakeDraft,
        teams: teams,
        team_order: teamOrderList,
      }),
    };
    fetch(`${API_URL}/create_draft`, requestParams)
      .then((response) => {
        console.log(`response: ${JSON.stringify(response, null, 4)}`);
        if (!response?.ok) {
          const error = response.status;
          console.log(`error: ${JSON.stringify(error, null, 4)}`);
          toast.error("Error creating draft.");
          return Promise.reject(error);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success === true) {
          if (data.temp) {
            localStorage.setItem("web_token", data.web_token);
          }
          localStorage.setItem("registeredLeague", "true");
          localStorage.setItem("liveDraft", "true");
          setTimeout(function () {
            toast.success("Draft created successfully.");
          }, 200);
        } else {
          toast.error("Error creating draft.");
        }
      });
  }

  const getTeamOrder = () => {
    let teamOrder = [];
    const teamOrderInputs = document.querySelectorAll(
      "#team-order-wrapper input"
    );
    teamOrderInputs.forEach((team) => {
      teamOrder.push({ id: team.id, order: parseInt(team.value) });
    });
    return teamOrder;
  };

  const instructions = () => {
    if (isRegisteredLeague) {
      return (
        <div className="warning">
          <Emoji emoji="⚠️" />
          This will create a new draft. If a draft is already active, this will
          replace it.
        </div>
      );
    }
    return (
      <div>
        <Emoji emoji="⚠️" />
        Your Yahoo league is not registered with SlowDraft yet. You can create a
        draft for your league now!
      </div>
    );
  };

  return (
    <form className="admin-form new-draft-form">
      <div className="instructions">{instructions()}</div>
      <div>
        <label>Rounds:</label>
        <input
          className="small-input"
          value={rounds}
          onChange={(e) => setRounds(e.target.value)}
        />
      </div>

      {/* 
        TODO: Add other draft config options here
      <div>
        <label>Snake draft:</label>
        <input
          type='checkbox'
          defaultValue={false}
          className='small-input'
          value={snakeDraft}
          onclick={(e) => setSnakeDraft(!snakeDraft)}
        />
      </div> 
      */}

      <div id="team-order-wrapper">
        <label>Draft order:</label>
        {teams?.map((team) => (
          <div key={team.yahoo_team_id}>
            <input
              id={team.yahoo_team_id}
              className="small-input"
              defaultValue={team.yahoo_team_id}
            />
            &nbsp;{team.team_name}
            <span className="username-small">({team.user})</span>
          </div>
        ))}
      </div>
      <br />
      <button onClick={createNewDraft}>Create draft</button>
    </form>
  );
}
