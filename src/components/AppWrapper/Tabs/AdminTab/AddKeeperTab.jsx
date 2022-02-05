import React, { useState } from 'react';
import { ToastsStore } from 'react-toasts';
import SelectPlayerDropdown from './SelectPlayerDropdown';
import { getHeaders, teamIdToKey, teamsMap } from '../../../../util/util';
import Emoji from '../../Emoji';

export default function AddKeeperTab({ singleTeam }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const [keeperPlayerId, setKeeperPlayerId] = useState(null);
  const [teamId, setTeamId] = useState(user.team_id);
  const formComplete = keeperPlayerId && teamIdToKey;
  const [keeperList, setKeeperList] = useState([]); 
  const teams = JSON.parse(localStorage.getItem('teams'));

  function addKeeper(e) {
    e.preventDefault();
    const requestParams = {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ 
        team_key: teamIdToKey(teamId),
        player_id: keeperPlayerId
      })
    }
    if ( teamId && keeperPlayerId ) {
      setKeeperList([...keeperList, [keeperPlayerId]]);
      fetch('/add_keeper_player', requestParams)
        .then(response => {
        if (!response.ok) {
          const error = response.status;
          return Promise.reject(error);
        }
        return response.json()
      })
      .then( data => {
        if (data.success === true) {
          setTimeout(function () {
            console.log(`keeperList: ${JSON.stringify(keeperList, null, 4)}`);
            ToastsStore.success('Keeper added successfully.')
          }, 500)
        } else {
          setKeeperPlayerId([]);
          ToastsStore.error('Error adding keeper.')
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
      { !singleTeam &&
      <>
        <div className='instructions'>
          <div className='warning'>
            <Emoji emoji='⚠️' /> 
            This will add the selected keeper for the selected team.
          </div>
        </div>
        <div>
          <label name='admin-user-dropdown'>Team:</label>
          { }
          <select 
            defaultValue={user.team_id}
            className='admin-user-dropdown'
            onChange={handleTeamIdChange}
          >
            { teamsMap(teams) }
          </select>
        </div>
      </>
      }
      <SelectPlayerDropdown
        handleClick={addKeeper}
        setPlayerId={setKeeperPlayerId}
        buttonName={"Add keeper"}
        formComplete={formComplete}
      />

      { singleTeam &&
        <div>
          {keeperList}
        </div>
      }
    </form>
  )
}
