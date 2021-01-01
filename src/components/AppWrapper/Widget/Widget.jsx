import React from 'react';
import NextPick from './NextPick/NextPick';
import './Widget.css';

export default function Widget({teamLogo, teamName, userPickingNow, pickExpiry, draftingNow, logout}) {

  return (
    <div className="widget-wrapper">
      <NextPick 
        userPickingNow={userPickingNow}
        pickExpiry={pickExpiry}
        draftingNow={draftingNow}
      />
      <div className="logo-and-logout-wrapper">
        <div className="logo-wrapper">
          <img className="logo" src={teamLogo} alt="icon"/>
        </div>
        <button id='logout' onClick={logout}>Logout</button>
      </div>
    </div>
  )
}