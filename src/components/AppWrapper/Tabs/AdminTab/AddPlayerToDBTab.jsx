import React from 'react';
import { ToastsStore } from 'react-toasts';

export default function AddPlayerToDBTab({ name, setName, playerId, setPlayerId, 
    team, setTeam, positions, setPositions }
  ) {

  const handleNameChange = event => {
    setName(event.target.value)
  };
  const handlePlayerIdChange = event => {
    setPlayerId(event.target.value)
  };
  const handleTeamChange = event => {
    setTeam(event.target.value)
  };
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

  function addPlayerToDb(e) {
    e.preventDefault();
    let requestParams = {
      method: 'POST',
      headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json'
      }
    };
    requestParams.body = JSON.stringify({ 
      name: name,
      player_id: playerId,
      team: team,
      positions: positions
    })
    if ( name && playerId && team && !positions.isEmpty() ) {    
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
    <form className='admin-form'>
      <h2>Add a player to the database</h2>
      <div>
        <label name='name'>Player name:</label>
        <input required type='text' name='name' label='name' onChange={handleNameChange} />
      </div>
      <div>
        <label name='yahooId'>Yahoo player id:</label>
        <input required type='text' pattern='[0-9]' name='yahooId' label='yahooId' onChange={handlePlayerIdChange} />
      </div>
      <div>
        <label name='team'>Team:</label>
        <select
          name='team'
          label='team'
          className='team-filter wide-filter'
          onChange={handleTeamChange}
        >
          <option value="Anh">Anaheim</option>
          <option value="Ari">Arizona</option>
          <option value="Bos">Boston</option>
          <option value="Buf">Buffalo</option>
          <option value="Cgy">Calgary</option>
          <option value="Car">Carolina</option>
          <option value="Chi">Chicago</option>
          <option value="Col">Cololardo</option>
          <option value="Cls">Columbus</option>
          <option value="Dal">Dallas</option>
          <option value="Det">Detroit</option>
          <option value="Edm">Edmonton</option>
          <option value="Fla">Florida</option>
          <option value="LA">L.A.</option>
          <option value="Min">Minnesota</option>
          <option value="Mon">Montreal</option>
          <option value="Nsh">Nashville</option>
          <option value="NJ">New Jersey</option>
          <option value="NYI">NY Islanders</option>
          <option value="NYR">NY Rangers</option>
          <option value="Ott">Ottawa</option>
          <option value="Phi">Philadelphia</option>
          <option value="Pit">Pittsburgh</option>
          <option value="SJ">San Jose</option>
          <option value="Sea">Seattle</option>
          <option value="StL">St. Louis</option>
          <option value="Tor">Toronto</option>
          <option value="TB">Tampa Bay</option>
          <option value="Van">Vancouver</option>
          <option value="VGK">Vegas</option>
          <option value="Was">Washington</option>
          <option value="Wpg">Winnipeg</option>
        </select>
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
      <button onClick={(e) => addPlayerToDb(e)}>Add player</button>
    </form>
  );

}