import React from "react";
import CountdownTimer from "./CountdownTimer/CountdownTimer";
import "./Widget.css";

export default function Widget({
  isRegisteredLeague,
  draftingNow,
  logout,
}) {
  const user = JSON.parse(localStorage.getItem("user"));
  const currentPick = JSON.parse(localStorage.getItem("currentPick"));
  console.log(`isRegisteredLeague: ${isRegisteredLeague}`);

  return (
    <div className="widget-wrapper">
      {isRegisteredLeague && currentPick && (
        <CountdownTimer
          currentPick={currentPick}
          expiryDate={currentPick.pick_expires}
          draftingNow={draftingNow}
        />
      )}
      <div className="logo-and-logout-wrapper">
        <div className="logo-wrapper">
          <img className="logo" src={user ? user.logo : null} alt="icon" />
        </div>
        <button id="logout" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
