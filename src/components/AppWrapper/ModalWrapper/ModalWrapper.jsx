import React from 'react';
import Modal from 'react-modal';
import './ModalWrapper.css';


export default function ModalWrapper({modalIsOpen, setIsOpen, player}) {
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }
  
  function closeModal(){
    setIsOpen(false);
  }

  function draftPlayer() {
    console.log("Player drafted.");
  }
  
  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel='Player Draft'
        parentSelector={() => document.querySelector('main')}
      >
        <div className='modal-draft-text'>You are about to draft:</div>
        <div className='modal-player-info'>
          <strong>{player.name}</strong> - {player.position} {player.team}
        </div>
        <div className='button-group'>
          <button className="button-large" onClick={() => draftPlayer(`${player.player_id}`)}>Draft</button>
          <button className="button-large" onClick={closeModal}>Cancel</button>
        </div>
      </Modal>
    </>
  )
}
