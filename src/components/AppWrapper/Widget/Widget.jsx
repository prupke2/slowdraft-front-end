import React from 'react';
import NextPick from './NextPick/NextPick';
import './Widget.css';

export default function Widget({currentPick, logout, user}) {

  return (
    <div className="widget-wrapper">
      { currentPick && 
        <NextPick 
          currentPick={currentPick}
          pickExpiry={currentPick.pick_expires}
          draftingNow={currentPick.drafting_now}
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
