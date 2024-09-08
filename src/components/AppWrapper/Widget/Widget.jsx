import React from "react";
import CountdownTimer from "./CountdownTimer/CountdownTimer";
import UsernameStyled from "../UsernameStyled/UsernameStyled";
import "./Widget.css";

export default function Widget({
  isRegisteredLeague,
  draftingNow,
  logout,
}) {
  const user = JSON.parse(localStorage.getItem("user"));
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
      <div className="logo-and-logout-wrapper">
        <UsernameStyled
          username={user.team_name}
          teamKey={user.team_key}
          color={user.color}
          small
          logoAndShortName
        />
        <button id="logout" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
