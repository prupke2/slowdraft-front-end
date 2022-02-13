import React from 'react';
import { ToastsStore } from 'react-toasts';
import { getHeaders } from '../../../../util/util';
import Emoji from '../../Emoji';
import { SelectTeamFilter } from '../../../Table/FilterTypes/FilterTypes';

export default function AddPlayerToDBTab({ name, setName, playerId, setPlayerId, 
    team, setTeam, positions, setPositions }
  ) {
  localStorage.setItem('adminTab', 'add_player');

  const handlePositionChange = event => {
    const newPosition = event.target.value;
    let newPositionsArray = positions
    if (event.target.checked) {
      newPositionsArray.push(newPosition)
    } else {
      const index = newPositionsArray.indexOf(newPosition)
      newPositionsArray.splice(index, 1)
    }
    setPositions(newPositionsArray)
  };
  const formComplete = name && playerId && !positions.isEmpty();

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
        <label name='name'>Player name:</label>
        <input 
          type='text' 
          name='name' 
          label='name' 
          onChange={e => setName(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label name='yahooId'>Yahoo player id:</label>
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
        <label name='team'>Team:</label>
        <SelectTeamFilter
          name='team'
          label='team'
          column={{filterValue: team, setFilter: (e => setTeam(e))}}
          wideFilter
        />
      </div>
      
      <div>
        <label className='position'>Positions: </label>
        <div className='positions'>
          <input type='checkbox' value='LW' name='LW' id='LW' onChange={handlePositionChange}/>
          <label htmlFor='LW'>LW</label>
          <input type='checkbox' value='RW' name='RW' id='RW' onChange={handlePositionChange}></input>
          <label htmlFor='RW'>RW</label>
          <input type='checkbox' value='C' name='C' id='C' onChange={handlePositionChange}></input>
          <label htmlFor='C'>C</label>
          <input type='checkbox' value='D' name='D' id='D' onChange={handlePositionChange}></input>
          <label htmlFor='D'>D</label>
          <input type='checkbox' value='G' name='G' id='G' onChange={handlePositionChange}></input>
          <label htmlFor='G'>G</label>
        </div>
      </div>
      <button 
        onClick={(e) => addPlayerToDb(e)}
        disabled={!formComplete}
      >
        Add player
      </button>
    </form>
  );

}
