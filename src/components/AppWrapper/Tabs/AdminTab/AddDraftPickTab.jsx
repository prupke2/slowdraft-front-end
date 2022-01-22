import React, { useState } from 'react';
import { ToastsStore } from 'react-toasts';
import { localEnvironment } from '../../../../util/util';
// import SelectPlayerDropdown from './SelectPlayerDropdown';

export default function AddDraftPickTab({ userInfo }) {
  const [userId, setUserId] = useState(351);

  function addNewPick(e) {
    e.preventDefault();
    const requestParams = {
      method: 'POST',
      headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        user_id: userId,
        league_id: userInfo.league_id,
        draft_id: userInfo.draft_id
      })
    }
    if ( userId ) {    
      fetch('/add_new_pick', requestParams)
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
            ToastsStore.success('Pick added successfully.')
          }, 1000)
        } else {
          ToastsStore.error('Error adding pick.')
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
      <h2>Add draft pick</h2>
      <p className='instructions'>
        <span role='img' aria-label='instructions'>⚠️</span> This will add a pick at the end of the draft for the specified team.
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
          { localEnvironment &&
            <option value={292}>LOCAL TESTING ONLY</option>
          }
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
