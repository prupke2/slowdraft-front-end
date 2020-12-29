import React from 'react';

export default function Logo({teamLogo}) {

  return (
    <div className="logo-wrapper">
      <img className="logo" src={teamLogo} alt="icon"/>
    </div>
  )
}
