import React, { useState } from "react";
import Modal from "react-modal";
import toast from "react-hot-toast";
import { getHeaders, API_URL } from "../../../../util/util";
import Loading from "../../../Loading/Loading";
import CloseModalButton from "../../ModalWrapper/CloseModalButton/CloseModalButton";
import "../../ModalWrapper/ModalWrappers.css";
import { playerDraftedAnnouncement, publishToChat } from "../../Chat/ChatAnnouncements/ChatAnnouncements";
import { useModalBlur } from "../../../../hooks/useModalBlur";

export default function DraftModal({
  player,
  channel,
}) {
  const [isOpen, setIsOpen] = useState(false);
  useModalBlur(isOpen);

  const [isLoading, setIsLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  function draftPlayer(data) {
    setIsLoading(true);
    const msg = playerDraftedAnnouncement(user.team_name, data.name, data.position, data.team);
    try {
      fetch(`${API_URL}/draft/${data.player_id}`, {
        method: "GET",
        headers: getHeaders(),
      })
        .then((response) => {
          if (!response.ok) {
            toast.error(`An error occurred. Please try again later.`);
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
          return response.json();
        })
        .then((data) => {
          const draftingAgain = data.drafting_again === true ? "You're up again!" : "";
          publishToChat(channel, user, msg);
          if (data.success !== true) {
            toast.error(`${data.error}`);
          } else {
            toast.success(
              `You have drafted ${data.player}. ${draftingAgain}`
            );
            const draftTab = document.querySelector('.navtab-list .navtab:first-child a');
            setTimeout(() => {
              draftTab.click();
            }, 500);
          }
          setIsOpen(false);
          setIsLoading(false);
        });
      } catch (err) {
        console.log('Error:', err);
        toast.error(`There was an error: ${err}. Please change tabs to see if the pick was saved before trying again.`);
        setIsOpen(false);
        setIsLoading(false);
      }
  }

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        Draft
      </button>
      { isOpen && (
        <Modal
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
          contentLabel="Player Draft"
          parentSelector={() => document.querySelector("main")}
          id="draft-player-modal"
          ariaHideApp={false}
        >
          <CloseModalButton setIsOpen={setIsOpen} />
          <div className="modal-title">You are about to draft:</div>
          <div className="modal-player-info">
            {typeof player.team !== "undefined" && (
              <>
                <strong>{player.name}</strong>, {player.position} -{" "}
                {player.team.toUpperCase()}
              </>
            )}
          </div>
          <div className="button-group">
            {isLoading && <Loading alt small text="Drafting..." />}
            {!isLoading && (
              <>
                <button className="cancel-button button-large" onClick={() => setIsOpen(false)}>
                  Cancel
                </button>
                <button
                  className="draft-button-modal button-large"
                  onClick={() => draftPlayer(player)}
                >
                  Draft
                </button>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
