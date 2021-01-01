import React, {useState} from 'react';
import './NextPick.css';
import { useEffect } from 'react';
import UsernameStyled from '../../UsernameStyled/UsernameStyled';

export default function NextPick({userPickingNow, pickExpiry, draftingNow}) {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const expiry = Date.parse(pickExpiry);
  const timeLeft = expiry - currentTime;

  const hours = (Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + (Math.floor(timeLeft / (1000 * 60 * 60 * 24))*24));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const formattedMinutes = ("0" + minutes).slice(-2);
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  const formattedSeconds = ("0" + seconds).slice(-2);

  const counter = isNaN(timeLeft) ? '' : hours + ":" + formattedMinutes + ":" + formattedSeconds;
  const countdownClock = timeLeft < 0 ? 'Expired' : counter;

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    }
  }, []);

  return (
    <>
    {/* <div className='current-pick-timer'> */}
      { userPickingNow && 
        <div className='drafting-now'>
          { draftingNow && 
            <p>You're up!&nbsp;</p>
          }
          { !draftingNow && 
            <p>Drafting:&nbsp;</p>
          }
          <UsernameStyled 
            username={userPickingNow.username}
            color={userPickingNow.color}
          />
          <p className='countdown-timer' id='countdown'>{countdownClock || ''}</p>
        </div>
      }
      {/* { !userPickingNow &&
        <p className="drafting-now">
          Draft has not started yet
        </p>
      } */}
    {/* </div> */}
    </>
  )

}