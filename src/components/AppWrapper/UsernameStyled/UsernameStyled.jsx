import React from 'react';
import './UsernameStyled.css';

export default function UsernameStyled({username, color, teamId}) {
  const teams = JSON.parse(localStorage.getItem('teams'));
  return (
    <p className='user-wrapper'>
      { (teamId && teams) &&
        <img className='user-logo' src={teams[teamId - 1].team_logo || null} alt='👤' />
      }
      { !teamId &&
        <span role='img' aria-label='icon' className="user-icon" style={{ 'background': color}}>👤</span>
      }
      <span className="userInDraft">{username}</span>
    </p>
  );
}
