import React from 'react';
import Modal from 'react-modal';
import './ModalWrapper.css';
import { ToastsStore } from 'react-toasts';


export default function ModalWrapper({modalIsOpen, setIsOpen, player}) {
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal(){
    setIsOpen(false);
  }

  function draftPlayer(player) {
    setIsOpen(false);
    ToastsStore.success(`You have drafted ${player.name}`);
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
          <button className="button-large" onClick={() => draftPlayer(player)}>Draft</button>
          <button className="button-large" onClick={closeModal}>Cancel</button>
        </div>
      </Modal>
    </>
  )
}
