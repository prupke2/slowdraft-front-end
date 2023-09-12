import React from "react";

export default function CloseModalButton({ setIsOpen, classes }) {
  function closeModal() {
    setIsOpen(false);
  }
  return (
    <div className={`close-button-wrapper ${classes}`}>
      <button className="close-modal" onClick={closeModal}>
        x
      </button>
    </div>
  );
}
