import React from 'react';
import './UsernameStyled.css';

export default function UsernameStyled({username, color}) {
  return (
    <p className='user-wrapper'>
      <span role='img' aria-label='icon' className="user-icon" style={{ 'background': color}}>👤</span>
      <span className="userInDraft">{username}</span>
    </p>
  );
}
