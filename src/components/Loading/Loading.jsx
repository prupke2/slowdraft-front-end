import React from 'react';
import loadingGif from '../../assets/loading.gif';
import './Loading.css';

export default function Loading(props) {
  return (
    <div className='loading-wrapper'>
      <div className='loading-text'>
        {props.text}
      </div>
      <img src={loadingGif} alt='' />
    </div>
  )
}
