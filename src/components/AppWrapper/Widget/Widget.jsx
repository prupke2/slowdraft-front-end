import React from 'react';
import NextPick from './NextPick/NextPick';
import './Widget.css';

export default function Widget({currentPick, draftingNow, logout, user}) {

  return (
    <div className="widget-wrapper">
      { currentPick && 
        <NextPick 
          currentPick={currentPick}
          pickExpiry={currentPick.pick_expires}
          draftingNow={draftingNow}
      />
      }
      <div className="logo-and-logout-wrapper">
        <div className="logo-wrapper">
          <img className="logo" src={user.logo} alt="icon"/>
        </div>
        <button id='logout' onClick={logout}>Logout</button>
      </div>
    </div>
  )
}
