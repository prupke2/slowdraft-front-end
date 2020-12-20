import React from 'react';

export default function CloseModalButton({setIsOpen}) {
  function closeModal(){
    setIsOpen(false);
  }
  return (
    <div className='close-button-wrapper'>
      <button className='close-modal' onClick={closeModal}>x</button>
    </div>
  )
}
