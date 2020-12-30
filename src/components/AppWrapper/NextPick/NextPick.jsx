import React, {useState} from 'react';
import './NextPick.css';
import { useEffect } from 'react';

export default function NextPick({userPickingNow, pickExpiry, draftingNow}) {
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
    <>
    <div className='current-pick-timer'>
      { userPickingNow && 
        <p className='drafting-now'>
          { draftingNow && 
            <p>You're up!</p>
          }
          { !draftingNow && 
          <>
            <p>Drafting:&nbsp;</p>
            <p>
              <span role='img' aria-label='icon' style={{ 'background': userPickingNow.color}}>👤</span>
              <span className="user">{userPickingNow.username}</span>
            </p>
          </>
          }
        </p>
      }
        <p className='countdown-timer' id='countdown'>{countdownClock}</p>
      {/* { !userPickingNow &&
        <p className="drafting-now">
          Draft has not started yet
        </p>
      } */}
    </div>
    </>
  )

}
