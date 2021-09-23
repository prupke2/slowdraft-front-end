import React from 'react';
import { ToastsStore } from 'react-toasts';
import { substringInString } from '../../../../util/util';
import { useState } from 'react';

export default function AddKeeperTab({ userId, setUserId, keeperPlayerId, setKeeperPlayerId }) {
  const userInfo = JSON.parse(localStorage.getItem('user'));
  const playerData = JSON.parse(localStorage.getItem('playerDBData'));
  const goalieData = JSON.parse(localStorage.getItem('goalieDBData'));

  const [text, setText] = useState("");

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
    e.preventDefault();
    setText(e.target.value);
    const players = playerData.players.filter(player => 
      substringInString(player.name.toUpperCase(), e.target.value.toUpperCase())
    );
    const goalies = goalieData.players.filter(goalie =>
      substringInString(goalie.name.toUpperCase(), e.target.value.toUpperCase())
    )
    // if (!players.isEmpty()) {
    //   setKeeperPlayerId(players[0].player_id)
    // } else if (!goalies.isEmpty()) {
    //   setKeeperPlayerId(goalies[0].player_id)
    // }
    return
  }

  const playerDiv = (player, i) => {
    function handlePlayerSelect() {
      console.log(`in handlePlayerSelect`);
      setKeeperPlayerId(player.player_id);
      setText(player.name);
      // console.log(`text: ${text}`);
      // console.log(`keeperPlayerId: ${keeperPlayerId}`);
    }
    if (text && substringInString(player.name.toUpperCase(), text.toUpperCase())) {
      return (
        <div 
          key={i}
          value={player.player_id}
          onClick={handlePlayerSelect}
        >
          {player.name}, {player.position}, {player.team}
        </div>
      )
    }
    return null;
  } 

  return (
    <form className='admin-form add-keeper-form'>
      <h2>Add a keeper to a team</h2>
      <div>
        <label name='admin-user-dropdown'>Team:</label>
        <select 
          className='admin-user-dropdown'
          onChange={handleUserIdChange}
        >
          <option value={351}>American Gladiators</option>
          <option value={441}>Fort Wayne Komets</option>
          <option value={301}>GrandRapids Griffins</option>
          <option value={371}>Nelson Leafs</option>
          <option value={381}>New Orleans Brass</option>
          <option value={321}>Ontario Reign</option>
          <option value={341}>Providence Bruins</option>
          <option value={331}>Seaforth Generals</option>
          <option value={411}>St. Marys Lincolns</option>
          <option value={391}>St. Thomas Stars</option>
          <option value={431}>Syracuse Crunch!</option>
          <option value={361}>Terrace River Kings</option>
          <option value={292}>LOCAL TESTING ONLY</option>
        </select>
      </div>
      <div>
        <label name='player'>Player:</label>
        <div className="player-search">
          <input
            id="player-search-input"
            type="text"
            value={text}
            placeholder="Find player..."
            onChange={handleKeeperText}
          />
          <div className="player-list-wrapper">
            {playerData.players.map((player, i) => playerDiv(player, i))}
            {goalieData.players.map((player, i) => playerDiv(player, i))}
          </div>
        </div>

          {/* // { substringInString(player.name, text) && (
          //   <div value={player.player_id}>{player.name}, {player.team}</div>
          // )}
          // <div selected={keeperPlayerId===player.player_id} value={player.player_id}>{player.name}, {player.team}</div> 
         */}
      </div>
      {/* <div>
        <label />
        <select 
          disabled 
          value={keeperPlayerId}
          className='admin-user-dropdown'
        >
          {playerData.players.map(player =>
            <div selected={keeperPlayerId===player.player_id} value={player.player_id}>{player.name}, {player.team}</div> 
          )}
          {goalieData.players.map(player =>
            <div selected={keeperPlayerId===player.player_id} value={player.player_id}>{player.name}, {player.team}</div> 
          )}
        </select>
      </div> */}
      <button onClick={(e) => addKeeper(e)} className="add-keeper-button">Add keeper</button>
    </form>
  )
}
