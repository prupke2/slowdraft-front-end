import React, { useState } from 'react';
import { ToastsStore } from 'react-toasts';
import { getHeaders } from '../../../../util/util';
import Emoji from '../../Emoji';
import { SelectTeamFilter } from '../../../Table/FilterTypes/FilterTypes';

export default function AddPlayerToDBTab() {
  localStorage.setItem('adminTab', 'add_player');
  const [name, setName] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [team, setTeam] = useState(null);
  const [positions, setPositions] = useState([]);

  const handlePositionChange = (event) => {
    const newPosition = event.target.value;
    let newPositionsArray = positions;
    if (event.target.checked) {
      newPositionsArray.push(newPosition)
    } else {
      const index = newPositionsArray.indexOf(newPosition)
      newPositionsArray.splice(index, 1)
    }
    setPositions(newPositionsArray);
  };
  const formComplete = name && playerId && team && positions.length !== 0;

  function addPlayerToDb(e) {
    e.preventDefault();
    let requestParams = {
      method: 'POST',
      headers: getHeaders()
    };
    requestParams.body = JSON.stringify({ 
      name: name,
      player_id: playerId,
      team: team,
      positions: positions
    })
    if ( formComplete ) {    
      fetch('/insert_player', requestParams)
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
            ToastsStore.success(`Player added successfully.`)
          }, 1000)
        } else {
          ToastsStore.error(`Error adding player.`)
        }
      });
    } else {
      ToastsStore.error(`Please fill out all the fields.`)
    }
  }

  return (
    <form className='admin-form add-player-to-db'>
      <div className='instructions flex-direction-column'>
        <div>
          <Emoji emoji='⚠️' /> 
          This will add a player to the database. 
        </div>
        <div className='warning'>
          Before proceeding, make sure this player has a yahoo profile.
        </div>
        To make sure the player is not already in the database, search with the "All players" filter.
      </div>
      <div>
        <label htmlFor='name' name='name'>Player name:</label>
        <input 
          type='text' 
          name='name' 
          label='name' 
          onChange={e => setName(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label htmlFor='yahooId' name='yahooId'>Yahoo player id:</label>
        <input 
          type='text' 
          pattern='[0-9]' 
          name='yahooId' 
          label='yahooId' 
          onChange={e => setPlayerId(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label className='position'>Positions: </label>
        <div className='positions'>
          {['LW', 'RW', 'D', 'C', 'G'].map(position => 
            <>
              <input type='checkbox' value={position} name={position} id={position} onChange={handlePositionChange}/>
              <label htmlFor={position}>{position}</label>
            </>  
          )}
        </div>
      </div>
      <div>
        <label htmlFor='team' name='team'>Team:</label>
        <SelectTeamFilter
          name='team'
          label='team'
          column={{filterValue: team, setFilter: (e => setTeam(e))}}
          wideFilter
          disableAll
        />
      </div>
      <button
        className='add-player-button'
        onClick={(e) => addPlayerToDb(e)}
        disabled={!formComplete}
      >
        Add player
      </button>
    </form>
  );

}
