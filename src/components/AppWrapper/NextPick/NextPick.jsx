import React, {useState} from 'react';
import moment from 'moment';
import './NextPick.css';
import { useEffect } from 'react';

export default function NextPick({userPickingNow, pickExpiry}) {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const expiry = Date.parse(pickExpiry);
  const timeLeft = expiry - currentTime;

  const hours = (Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + (Math.floor(timeLeft / (1000 * 60 * 60 * 24))*24));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const formattedMinutes = ("0" + minutes).slice(-2);
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  const formattedSeconds = ("0" + seconds).slice(-2);

  const countdownClock = hours + ":" + formattedMinutes + ":" + formattedSeconds

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    }
  }, []);

  return (
    <div className="current-pick-timer">
      <p className="drafting-now">
        <p>Drafting:&nbsp;</p>
        <div class>
          <span role='img' aria-label='icon' style={{ 'background': userPickingNow.color}}>👤</span>
          <span className="user">{userPickingNow.username}</span>
        </div>
      </p>
      <p className="countdown-timer" id="countdown">{countdownClock}</p>
    </div>
  )
}
