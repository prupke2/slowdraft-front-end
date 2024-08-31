import React, { useState } from "react";
import Modal from "react-modal";
import toast from "react-hot-toast";
import {
  getDraft,
  getDBPlayers,
  getTeams,
} from "../../../../util/requests";
import { getHeaders, API_URL } from "../../../../util/util";
import Loading from "../../../Loading/Loading";
import CloseModalButton from "../../ModalWrapper/CloseModalButton/CloseModalButton";
import "../../ModalWrapper/ModalWrappers.css";
import { playerDraftedAnnouncement, publishToChat } from "../../Chat/ChatAnnouncements/ChatAnnouncements";

export default function DraftModal({
  modalIsOpen,
  setIsOpen,
  data,
  modalType,
  setTeams,
  setPicks,
  currentPick,
  setCurrentPick,
  setDraftingNow,
  setPlayers,
  channel,
}) {
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
            toast(`An error occurred. Please try again later.`);
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
          return response.json();
        })
        .then((data) => {
          const draftingAgain = data.drafting_again === true ? "You're up again!" : "";
          publishToChat(channel, user, msg);
          getDraft(setCurrentPick, setDraftingNow);
          getTeams();
          getDBPlayers();
          if (data.success !== true) {
            toast(`${data.error}`);
          } else {
            toast(
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
        toast(`There was an error: ${err}. Please change tabs to see if the pick was saved before trying again.`);
        setIsOpen(false);
        setIsLoading(false);
      }
  }

  if (modalType === "draftPlayer") {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="Player Draft"
        parentSelector={() => document.querySelector("main")}
        id="draft-player-modal"
        setPicks={setPicks}
        currentPick={currentPick}
        setCurrentPick={setCurrentPick}
        setDraftingNow={setDraftingNow}
        setPlayers={setPlayers}
        setTeams={setTeams}
        ariaHideApp={false}
      >
        <CloseModalButton setIsOpen={setIsOpen} />
        <div className="modal-title">You are about to draft:</div>
        <div className="modal-player-info">
          {typeof data.team !== "undefined" && (
            <>
              <strong>{data.name}</strong>, {data.position} -{" "}
              {data.team.toUpperCase()}
            </>
          )}
        </div>
        <div className="button-group">
          {isLoading && <Loading alt small text="Drafting..." />}
          {!isLoading && (
            <>
              <button
                className="button-large"
                onClick={() => draftPlayer(data)}
              >
                Draft
              </button>
              <button className="button-large" onClick={() => setIsOpen(false)}>
                Cancel
              </button>
            </>
          )}
        </div>
      </Modal>
    );
  }
}
