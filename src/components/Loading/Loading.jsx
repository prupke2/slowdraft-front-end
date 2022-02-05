import React from 'react';
import scoreboardLoading from '../../assets/scoreboardLoading.gif';
import gearsLoading from '../../assets/gearsLoading.gif';
import './Loading.css';

export default function Loading( {text, absolute, alt}) {
  const absolutePositioning = absolute ? 'absolute' : null;
  const loadingGif = alt === true ? gearsLoading : scoreboardLoading;
  return (
    <div className={`loading-wrapper ${absolutePositioning}`}>
      <div className='loading-text'>
        {text}
      </div>
      <img src={loadingGif} alt='' />
    </div>
  )
}
