import React from 'react';
import './UsernameStyled.css';

export default function UsernameStyled({ username, color, teamId, setUpdateTab }) {

  const teams = JSON.parse(localStorage.getItem('teams'));
  return (
    <p className='user-wrapper' onClick={() => setUpdateTab(`teams?team=${teamId}`)}>
      { (teamId && teams) &&
        <img className='user-logo' src={teams[teamId - 1].team_logo || null} alt='👤' />
      }
      { !teamId &&
        <span role='img' aria-label='icon' className="user-icon" style={{ 'background': color}}>👤</span>
      }
      <span className="user-in-draft">{username}</span>
    </p>
  );
}
