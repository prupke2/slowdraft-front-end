import React, { useState } from 'react';
import { ToastsStore } from 'react-toasts';
import { getHeaders, teamIdToKey, teamsMap } from '../../../../util/util';
import Emoji from '../../Emoji';

export default function AddDraftPickTab() {
  const user = JSON.parse(localStorage.getItem('user'));
  const teams = JSON.parse(localStorage.getItem('teams'));
  const [teamId, setTeamId] = useState(user.team_id);
  function addNewPick(e) {
    e.preventDefault();
    const requestParams = {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ 
        team_key: teamIdToKey(teamId)
      })
    }
    if ( teamId ) {    
      fetch('/add_new_pick', requestParams)
        .then(response => {
        if (!response.ok) {
          const error = response.status;
          console.log(`error: ${JSON.stringify(error, null, 4)}`);
          return Promise.reject(error);
        }
        return response.json()
      })
      .then( data => {
        if (data.success === true) {
          setTimeout(function () {
            ToastsStore.success('Pick added successfully.')
          }, 200)
        } else {
          ToastsStore.error('Error adding pick.')
        }
      });
    } else {
      ToastsStore.error('Please fill out all the fields.')
    }
  }

  const handleTeamIdChange = event => {
    setTeamId(event.target.value)
  };
  
  return (
    <form className='admin-form add-keeper-form'>
      <div className='instructions'>
        <div>
          <Emoji emoji='⚠️' />
          This will add a pick at the end of the draft for the specified team.
        </div>
      </div>
      <div>
        <label name='admin-user-dropdown'>Team:</label>
        <select 
          className='admin-user-dropdown'
          onChange={handleTeamIdChange}
        >
          { teamsMap(teams) }
        </select>
      </div>
      <br />
      <button
        onClick={addNewPick}
      >
        Add draft pick
      </button>
    </form>
  )
}
