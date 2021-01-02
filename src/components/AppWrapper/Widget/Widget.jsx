import React from 'react';
import NextPick from './NextPick/NextPick';
import './Widget.css';

export default function Widget({teamLogo, teamName, userPickingNow, pickExpiry, currentPick, draftingNow, logout}) {

  
  return (
    <div className="widget-wrapper">
      { currentPick && 
        <NextPick 
          userPickingNow={userPickingNow}
          pickExpiry={currentPick.pick_expires}
          draftingNow={currentPick.drafting_now}
        />
      }
      <div className="logo-and-logout-wrapper">
        <div className="logo-wrapper">
          <img className="logo" src={teamLogo} alt="icon"/>
        </div>
        <button id='logout' onClick={logout}>Logout</button>
      </div>
    </div>
  )
}
