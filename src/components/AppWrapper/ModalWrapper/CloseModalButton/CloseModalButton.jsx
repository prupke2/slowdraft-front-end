import React from "react";
import Emoji from "../../Emoji";

export default function CloseModalButton({ setIsOpen, classes }) {
  function closeModal() {
    setIsOpen(false);
  }
  return (
    <div className={`close-button-wrapper ${classes}`}>
      <button className="close-modal" onClick={closeModal}>
        <Emoji emoji="✖️" />
      </button>
    </div>
  );
}
