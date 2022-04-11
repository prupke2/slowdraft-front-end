import React, { useState } from 'react';
import { ToastsStore } from 'react-toasts';
import { getHeaders } from '../../../../util/util';
import Emoji from '../../Emoji';

export default function NewDraftTab() {
  const teams = JSON.parse(localStorage.getItem('teams'));
  const [rounds, setRounds] = useState(14);
  // const [snakeDraft, setSnakeDraft] = useState(false);
  localStorage.setItem('adminTab', 'new-draft');

  function createNewDraft(e) {
    e.preventDefault();
    const teamOrderList = getTeamOrder();
    const requestParams = {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ 
        rounds: rounds,
        // snake: snakeDraft,
        team_order: teamOrderList
      })
    } 
    fetch('/create_draft', requestParams)
      .then(response => {
        console.log(`response: ${JSON.stringify(response, null, 4)}`);
      if (!response?.ok) {
        const error = response.status;
        console.log(`error: ${JSON.stringify(error, null, 4)}`);
        ToastsStore.error('Error creating draft.')
        return Promise.reject(error);
      }
      return response.json()
    })
    .then( data => {
      if (data.success === true) {
        setTimeout(function () {
          ToastsStore.success('Draft created successfully.')
        }, 200)
      } else {
        ToastsStore.error('Error creating draft.')
      }
    });
  }

  const getTeamOrder = () => {
    let teamOrder = [];
    const teamOrderInputs = document.querySelectorAll('#team-order-wrapper input');
    teamOrderInputs.forEach(team => {
      console.log(team);
      teamOrder.push({id: team.id, order: parseInt(team.value)})
    })
    return teamOrder;
  };
  
  return (
    <form className='admin-form new-draft-form'>
      <div className='instructions'>
        <div className='warning'>
          <Emoji emoji='⚠️' />
          This will create a new draft. If a draft is already active, this will replace it.
        </div>
      </div>
      <div>
        <label>Rounds:</label>
        <input 
          className='small-input'
          defaultValue={14}
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

      <div id='team-order-wrapper'>
        <label>Draft order:</label>
        { teams.map(team =>
          <div>
            <input 
              key={team.yahoo_team_id}
              id={team.yahoo_team_id}
              className='small-input'
              defaultValue={team.yahoo_team_id}
            />&nbsp;{team.team_name} 
            <span className='username-small'>({team.user})</span>
          </div>
        )}
      </div>
      <br />
      <button
        onClick={createNewDraft}
      >
        Create draft
      </button>
    </form>
  )
}
