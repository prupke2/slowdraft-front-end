import React, { useState } from 'react';
import { substringInString } from '../../../../util/util';

export default function SelectPlayerDropdown({ handleClick, setPlayerId, buttonName, formComplete }) {
  const playerData = JSON.parse(localStorage.getItem('playerDBData'));
  const goalieData = JSON.parse(localStorage.getItem('goalieDBData'));
  const [text, setText] = useState('');
  function handleKeeperText(e) {
    e.preventDefault();
    setText(e.target.value);
  }

  const playerDiv = (player) => {
    function handlePlayerSelect() {
      setPlayerId(player.player_id);
      setText(`${player.name}`);
    }
    const match = text !== '' && substringInString(player.name.toUpperCase(), text.toUpperCase());
    if (!match) {
      return null;
    }
    const prospect = player.prospect === '1' ? '(prospect)' : '';
    return (
      <>
        {match &&
          <div 
            key={player.player_id}
            value={player.player_id}
            onClick={handlePlayerSelect}
          >
            {player.name}, {player.position}, {player.team} {` `}
            {prospect &&
              <span>&nbsp;
                <span className='prospect' title='Prospect'>P</span>
              </span>
            }
          </div>
        }
      </>
    )
  } 

  return (
    <>
      <div>
        <label className='player-label' name='player'>Player:</label>
        <div className='player-search'>
          <input
            className='player-search-input'
            type='text'
            value={text}
            placeholder='Find player...'
            onChange={handleKeeperText}
          />
          <button id='clear-field' onClick={e => {
            e.preventDefault();
            setText('');
          }}>x</button>
          <div className='player-list-wrapper'>
            {playerData.players.map((player, i) => playerDiv(player, i))}
            {goalieData.players.map((player, i) => playerDiv(player, i))}
          </div>
        </div>
      </div>
      <button 
        onClick={(e) => handleClick(e)} 
        className='add-player-button'
        disabled={!formComplete}
        >{ buttonName }
      </button>
    </>
  )
}
