import React from 'react';
import './AppWrapper.css';

export default function Emoji({ emoji, navbar }) {
  const navbarClass = navbar ? 'navbar-emoji' : null;
  return (
    <span className={navbarClass} role='img' aria-label='draft'>
      {emoji}
    </span>
  );
}
