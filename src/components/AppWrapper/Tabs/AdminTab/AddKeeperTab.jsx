import React, { useState } from 'react';
import { ToastsStore } from 'react-toasts';
import SelectPlayerDropdown from './SelectPlayerDropdown';

export default function AddKeeperTab({ userInfo }) {
  const [keeperPlayerId, setKeeperPlayerId] = useState(null);
  const [userId, setUserId] = useState(351);

  function addKeeper(e) {
    e.preventDefault();
    const requestParams = {
      method: 'POST',
      headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        user_id: userId,
        player_id: keeperPlayerId,
        draft_id: userInfo.draft_id
      })
    }
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
            ToastsStore.success('Keeper added successfully.')
          }, 1000)
        } else {
          ToastsStore.error('Error adding keeper.')
        }
      });
    } else {
      ToastsStore.error('Please fill out all the fields.')
    }
  }

  const handleUserIdChange = event => {
    setUserId(event.target.value)
  };
  
  return (
    <form className='admin-form add-keeper-form'>
      <h2>Add a keeper to a team</h2>
      <p className='instructions'>
        <div className='warning'>
          <span role='img' aria-label='instructions'>⚠️</span>
          This will add the selected keeper for the selected team.
        </div>
      </p>
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
          {/* <option value={292}>LOCAL TESTING ONLY</option> */}
        </select>
      </div>

      <SelectPlayerDropdown
        onClick={addKeeper}
        setPlayerId={setKeeperPlayerId}
        buttonName={"Add keeper"}
      />
    </form>
  )
}
