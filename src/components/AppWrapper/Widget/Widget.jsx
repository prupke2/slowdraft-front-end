import React, { useState } from "react";
import CountdownTimer from "./CountdownTimer/CountdownTimer";
import "./Widget.css";
import Emoji from "../Emoji";
import toast from "react-hot-toast";

export default function Widget({
  isRegisteredLeague,
  draftingNow,
  logout,
}) {
  const currentPick = JSON.parse(localStorage.getItem("currentPick"));
  const [soundPreference, setSoundPreference] = useState(localStorage.getItem("soundPreferences"));
  if (!soundPreference) {
    localStorage.setItem("soundPreferences", "enabled");
    setSoundPreference("enabled");
  }
  const soundPreferenceEmoji = soundPreference === "enabled" ? "🔊" : "🔇";
  const soundPreferenceTitle = soundPreference === "enabled" ? "Mute all sounds" : "Play a sound when I'm up to draft";

  const toggleSoundPreference = () => {
    const newValue = soundPreference === "disabled" ? "enabled" : "disabled";
    setSoundPreference(newValue);
    localStorage.setItem("soundPreferences", newValue);
    toast.success(`Draft notification sounds ${newValue}.`);
  };

  return (
    <div className="widget-wrapper">
      <div
        id="sound-preference"
        className="widget-inner sound-preference-wrapper"
        onClick={toggleSoundPreference}
        title={soundPreferenceTitle}
      >
        <Emoji emoji={soundPreferenceEmoji} />
      </div>
      {isRegisteredLeague && currentPick && (
        <CountdownTimer
          currentPick={currentPick}
          expiryDate={currentPick.pick_expires}
          draftingNow={draftingNow}
        />
      )}
      <div className="widget-inner logout-wrapper">
        <button id="logout" onClick={logout}>
           <Emoji emoji="🔓" />&nbsp;Logout
        </button>
      </div>
    </div>
  );
}
