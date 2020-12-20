import React from 'react';

export default function CloseModalButton({closeModal}) {
  return (
    <div className='close-button-wrapper'>
      <button className='close-modal' onClick={closeModal}>x</button>
    </div>
  )
}
