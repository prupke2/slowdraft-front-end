import React, { useState } from "react";
import Modal from "react-modal";
import { ToastsStore } from "react-toasts";
import {
  getDraft,
  getDBGoalies,
  getDBPlayers,
  getTeams,
} from "../../../../util/requests";
import { getHeaders, API_URL } from "../../../../util/util";
import Loading from "../../../Loading/Loading";
import CloseModalButton from "../../ModalWrapper/CloseModalButton/CloseModalButton";
import "../../ModalWrapper/ModalWrappers.css";
import { playerDraftedAnnouncement } from "../../Chat/ChatAnnouncements/ChatAnnouncements";

export default function DraftModal({
  modalIsOpen,
  setIsOpen,
  data,
  modalType,
  sendChatAnnouncement,
  setTeams,
  setPicks,
  currentPick,
  setCurrentPick,
  setDraftingNow,
  setPlayers,
  setGoalies,
  ws,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  function draftPlayer(data) {
    setIsLoading(true);
    const isGoalie = data.position === "G" ? true : false;
    const msg = playerDraftedAnnouncement(user.team_name, data.name, data.position, data.team);
    fetch(`${API_URL}/draft/${data.player_id}`, {
      method: "GET",
      headers: getHeaders(),
    })
      .then((response) => {
        if (!response.ok) {
          ToastsStore.error(`An error occurred. Please try again later.`);
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        return response.json();
      })
      .then((data) => {
        const draftingAgain =
          data.drafting_again === true ? "You're up again!" : "";
        ws.send(msg);
        getDraft(setCurrentPick, setDraftingNow);
        getTeams();
        isGoalie && getDBGoalies();
        !isGoalie && getDBPlayers();
        if (data.success !== true) {
          ToastsStore.error(`Error: ${data.error}`);
        } else {
          ToastsStore.success(
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
          {isLoading && <Loading alt={true} text="Drafting..." />}
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
