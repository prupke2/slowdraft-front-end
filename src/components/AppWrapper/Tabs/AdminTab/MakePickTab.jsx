import React, { useState} from 'react';
import { ToastsStore } from 'react-toasts';
import SelectPlayerDropdown from './SelectPlayerDropdown';


export default function MakePickTab({ userInfo, sendChatAnnouncement }) {
  const [userId, setUserId] = useState(351);
  const [playerId, setPlayerId] = useState(null);

  const handleUserIdChange = event => {
    setUserId(event.target.value)
  };

  function draftPlayer(e) {
    e.preventDefault();
    if (!playerId) {
      ToastsStore.error(`You forgot to select a player.`);
      return
    } 
    fetch(`/draft/${userInfo.draft_id}/${userId}/${playerId}`)
    .then(response => {
      if (!response.ok) {
        ToastsStore.error(`An error occurred. Please try again later.`)
        const error = response.status;
        return Promise.reject(error);
      }
      return response.json()
    })
    .then(data => {
      // sendChatAnnouncement(message);
      ToastsStore.success(`👍 Success! Check the draft and teams page to make sure everything looks good.`)
    })
  }
  return (
    <form className='admin-form add-keeper-form'>
      <h2>Make a pick for another team</h2>
      <p className='instructions'>
        ⚠️ This will draft a player for another team.<br />
        It will also send out the "Next Pick" email.
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
          <option value={292}>LOCAL TESTING ONLY</option>
        </select>
      </div>
      <SelectPlayerDropdown
        onClick={e => draftPlayer(e)}
        setPlayerId={setPlayerId}
        buttonName={"Draft player"}
      />
    </form>
  )
}
