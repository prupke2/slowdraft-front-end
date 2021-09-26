import React, { useState } from 'react';
import { substringInString } from '../../../../util/util';

export default function SelectPlayerDropdown({ onClick, setPlayerId, buttonName }) {
  const playerData = JSON.parse(localStorage.getItem('playerDBData'));
  const goalieData = JSON.parse(localStorage.getItem('goalieDBData'));
  const [text, setText] = useState("");


  function handleKeeperText(e) {
    e.preventDefault();
    setText(e.target.value);
  }

  const playerDiv = (player, i) => {
    function handlePlayerSelect() {
      setPlayerId(player.player_id);
      setText(player.name);
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
    <>
      <div>
        <label name='player'>Player:</label>
        <div className="player-search">
          <input
            className="player-search-input"
            type="text"
            value={text}
            placeholder="Find player..."
            onChange={handleKeeperText}
          />
          <button id="clear-field" onClick={e => {
            e.preventDefault();
            setText('');
          }}>x</button>
          <div className="player-list-wrapper">
            {playerData.players.map((player, i) => playerDiv(player, i))}
            {goalieData.players.map((player, i) => playerDiv(player, i))}
          </div>
        </div>
      </div>
      <button onClick={(e) => onClick(e)} className="add-player-button">{ buttonName }</button>
    </>
  )
}
