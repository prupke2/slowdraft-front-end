import React from 'react';

export default function UsernameStyled({username, color}) {
  return (
    <p>
      <span role='img' aria-label='icon' style={{ 'background': color}}>👤</span>
      <span className="user">{username}</span>
    </p>
  );
}
