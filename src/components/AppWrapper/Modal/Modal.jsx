import React from 'react';
import Modal from 'react-modal';


export default function ModalWrapper({modalIsOpen, setIsOpen}) {
  // let subtitle;

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal(){
    setIsOpen(false);
  }
  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
        <button onClick={closeModal}>x</button>
        <div>Modal text</div>
      </Modal>
    </>
  )
}
