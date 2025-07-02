import React, { useState } from "react";
import "./CountdownTimer.css";
import { useEffect } from "react";
import UsernameStyled from "../../UsernameStyled/UsernameStyled";
import { offsetMilliseconds } from "../../../../util/requests";
import { isMobileUser } from "../../../../util/util";

export default function CountdownTimer({ currentPick, expiryDate, draftingNow, draftCountdown }) {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const expiry = Date.parse(expiryDate);
  const timeLeft = expiry - currentTime - offsetMilliseconds;
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = draftCountdown ? Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) :
    Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) +
    Math.floor(timeLeft / (1000 * 60 * 60 * 24)) * 24;
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const formattedMinutes = ("0" + minutes).slice(-2);
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  const formattedSeconds = ("0" + seconds).slice(-2);

  const counter = isNaN(timeLeft) ? ""
    : hours + ":" + formattedMinutes + ":" + formattedSeconds;

  const countdownClock = timeLeft < 0 ? "Expired" : counter;

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <>
      {draftCountdown &&
        <div className="draft-countdown">
          <h2>Countdown to draft:</h2>
          <div>
            {days === 1 && 
              <span>1 day,</span>
            }
            {days > 1 &&  
              <span>{days} days,</span>
            }
            {
              <span>
                {` ` + countdownClock || ""} 
              </span>
            }
          </div>
        </div>
      }
      {currentPick?.team_key && (
        <div className={`drafting-now drafting-${draftingNow}`}>
          <div className="drafting-verbiage">Drafting: </div>
          <UsernameStyled
            username={currentPick.username}
            teamKey={currentPick.team_key}
            small
            logoAndShortName={!isMobileUser}
          />
          <p className="countdown-timer" id="countdown">
            {countdownClock || ""}
          </p>
        </div>
      )}
    </>
  );
}
