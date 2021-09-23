import React, { useState } from 'react';
import './AdminTab.css';
import { ToastsStore } from "react-toasts";
import { substringInString } from '../../../../util/util';

export default function AdminTab() {
  // eslint-disable-next-line no-extend-native
  Object.prototype.isEmpty = function () {
    return Object.keys(this).length === 0;
  }
  const userInfo = JSON.parse(localStorage.getItem('user'));
  const playerData = JSON.parse(localStorage.getItem('playerDBData'));
  const goalieData = JSON.parse(localStorage.getItem('goalieDBData'));
  const [name, setName] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [team, setTeam] = useState('Anh');
  const [positions, setPositions] = useState([]);

  const [userId, setUserId] = useState(351);
  const [keeperPlayerId, setKeeperPlayerId] = useState(null);


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

  function addKeeper(e) {
    e.preventDefault();
    let requestParams = {
      method: 'POST',
      headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json'
      }
    };
    requestParams.body = JSON.stringify({ 
      user_id: userId,
      player_id: keeperPlayerId,
      draft_id: userInfo.draft_id
    })
    if ( userId && keeperPlayerId ) {    
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
            ToastsStore.success(`Keeper added successfully.`)
          }, 1000)
        } else {
          ToastsStore.error(`Error adding keeper.`)
        }
      });
    } else {
      ToastsStore.error(`Please fill out all the fields.`)
    }
  }

  const handleUserIdChange = event => {
    setUserId(event.target.value)
  };

  function handleKeeperText(e) {
    const players = playerData.players.filter(player => 
      substringInString(player.name.toUpperCase(), e.target.value.toUpperCase())
    );
    const goalies = goalieData.players.filter(goalie =>
      substringInString(goalie.name.toUpperCase(), e.target.value.toUpperCase())
    )
    if (!players.isEmpty()) {
      setKeeperPlayerId(players[0].player_id)
    } else if (!goalies.isEmpty()) {
      setKeeperPlayerId(goalies[0].player_id)
    }
    return
  }
  
  return (
    <>
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
      <form className='admin-form add-keeper-form'>
        <h2>Add a keeper to a team</h2>
        <div>
          <label name='admin-user-dropdown'>Team:</label>
          <select 
            className='admin-user-dropdown'
            onChange={handleUserIdChange}
          >
            <option value={351}>American Gladiators</option>
            <option value={411}>Bakersfield Condors</option>
            <option value={441}>Fort Wayne Komets</option>
            <option value={301}>GrandRapids Griffins</option>
            <option value={371}>Nelson Leafs</option>
            <option value={381}>New Orleans Brass</option>
            <option value={321}>Ontario Reign</option>
            <option value={341}>Providence Bruins</option>
            <option value={331}>Seaforth Generals</option>
            <option value={391}>St Thomas Stars</option>
            <option value={431}>Syracuse Crunch!</option>
            <option value={361}>Terrace River Kings</option>
            <option value={321}>Ontario Reign</option>
            {/* <option value={292}>LOCAL TESTING ONLY</option> */}
          </select>
        </div>
        <div>
          {/* <label name='admin-player-id'>Yahoo player id:</label> */}
          {/* <input 
            data={playerData.players}
            className="admin-player-id"
            type="text" 
            placeholder="Yahoo player id" 
            onChange={handleKeeperPlayerIdChange}>
          </input> */}
          <label name='player'>Player:</label>
          <input
            type="text"
            placeholder="Find player..."
            onChange={handleKeeperText}
          />
        </div>
        <div>
          <label />
          <select 
            disabled 
            value={keeperPlayerId}
            className='admin-user-dropdown'
          >
            {playerData.players.map(player =>
              <option selected={keeperPlayerId===player.player_id} value={player.player_id}>{player.name}, {player.team}</option> 
            )}
            {goalieData.players.map(player =>
              <option selected={keeperPlayerId===player.player_id} value={player.player_id}>{player.name}, {player.team}</option> 
            )}
          </select>
        </div>
        <button onClick={(e) => addKeeper(e)} className="add-keeper-button">Add keeper</button>
      </form>
    </>
  );
}

