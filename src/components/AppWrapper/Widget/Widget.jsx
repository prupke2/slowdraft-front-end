import React from "react";
import CountdownTimer from "./CountdownTimer/CountdownTimer";
import "./Widget.css";

export default function Widget({
  isRegisteredLeague,
  draftingNow,
  logout,
}) {
  const currentPick = JSON.parse(localStorage.getItem("currentPick"));

  return (
    <div className="widget-wrapper">
      {isRegisteredLeague && currentPick && (
        <CountdownTimer
          currentPick={currentPick}
          expiryDate={currentPick.pick_expires}
          draftingNow={draftingNow}
        />
      )}
      <div className="logout-wrapper">
        <button id="logout" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
