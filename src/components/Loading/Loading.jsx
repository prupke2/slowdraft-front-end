import React from 'react';
import loadingGif from '../../assets/loading.gif';
import './Loading.css';

export default function Loading( {text, absolute}) {
  const absolutePositioning = absolute ? 'absolute' : null;
  return (
    <div className={`loading-wrapper ${absolutePositioning}`}>
      <div className='loading-text'>
        {text}
      </div>
      <img src={loadingGif} alt='' />
    </div>
  )
}
