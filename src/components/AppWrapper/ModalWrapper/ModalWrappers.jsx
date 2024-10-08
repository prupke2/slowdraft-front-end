import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import parse from "html-react-parser";
import CloseModalButton from "./CloseModalButton/CloseModalButton";
import NewPost from "./NewPost/NewPost";
import { getHeaders, capitalizeFirstLetter, API_URL } from "../../../util/util";
import { timeSince } from "../../../util/time";
import UsernameStyled from "../UsernameStyled/UsernameStyled";
import "./ModalWrappers.css";

export const ViewForumPost = ({
  modalIsOpen,
  setIsOpen,
  post,
  editPostHandler,
}) => {
  const [forumPostReplies, setForumPostReplies] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!forumPostReplies) {
      fetch(`${API_URL}/view_post_replies/${post.id}`, {
        method: "GET",
        headers: getHeaders(),
      })
        .then((res) => res.json())
        .then((data) => {
          setForumPostReplies(data.replies);
        });
    }
  }, [forumPostReplies, setForumPostReplies, post.id]);

  function editReplyHandler(reply) {
    editPostHandler(reply);
    setIsOpen(false);
  }

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => setIsOpen(false)}
      contentLabel="Forum Post"
      parentSelector={() => document.querySelector("main")}
      id="forum-post-modal"
      ariaHideApp={false}
    >
      <CloseModalButton setIsOpen={setIsOpen} />
      <div className="modal-title">{parse(post.title)}</div>
      <span className="modal-forum-user">
        <UsernameStyled
          username={post.username}
          color={post.color}
          teamKey={post.team_key}
        />
        &nbsp;
        <div className="modal-forum-date">{timeSince(post.create_date)}</div>
      </span>
      <div className="modal-forum-text">{parse(post.body)}</div>

      {forumPostReplies && (
        <div className="replies">
          {forumPostReplies.map((reply) => (
            <div key={reply.id} className="forum-reply">
              <span className="modal-forum-user">
                <UsernameStyled
                  username={reply.username}
                  color={reply.color}
                  teamKey={reply.team_key}
                />
                <div className="date-and-edit-button-wrapper">
                  <div className="modal-forum-date">
                    {timeSince(reply.create_date)}
                  </div>
                  {reply.username === user.team_name && (
                    <button
                      className="small-button"
                      onClick={() => editReplyHandler(reply)}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </span>
              <div className="modal-forum-text">
                {parse(reply.body)}
              </div>
            </div>
          ))}
        </div>
      )}
      <NewPost
        parentPostId={post.id}
        setIsOpen={setIsOpen}
        postType="create_post"
        user={user}
      />
    </Modal>
  );
};

export const NewForumPost = ({ modalIsOpen, setIsOpen, user, post }) => {
  const type = post ? "edit" : "new";
  const isReplyEdit = type === "edit" && post?.parent_id;
  const modalTitle = isReplyEdit
    ? "Edit reply"
    : `${capitalizeFirstLetter(type)} forum post`;

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => setIsOpen(false)}
      contentLabel="New Forum Post"
      parentSelector={() => document.querySelector("main")}
      id="new-forum-post-modal"
      ariaHideApp={false}
    >
      <CloseModalButton setIsOpen={setIsOpen} />
      <div className="modal-title">{modalTitle}</div>
      <NewPost
        setIsOpen={setIsOpen}
        postType={type === "edit" ? "edit_post" : "create_post"}
        user={user}
        post={post || null}
      />
    </Modal>
  );
};

export const NewRuleModal = ({ modalIsOpen, setIsOpen, user, data }) => {
  const type = data ? "edit" : "new";
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => setIsOpen(false)}
      contentLabel="New Rule"
      parentSelector={() => document.querySelector("main")}
      id="new-rule-modal"
      ariaHideApp={false}
    >
      <CloseModalButton setIsOpen={setIsOpen} />
      <div className="modal-title">{capitalizeFirstLetter(type)} Rule</div>
      <NewPost
        setIsOpen={setIsOpen}
        postType={type === "edit" ? "edit_rule" : "create_rule"}
        user={user}
        post={data || null}
      />
    </Modal>
  );
};

export const ViewRuleModal = ({ modalIsOpen, setIsOpen, data }) => (
  <Modal
    isOpen={modalIsOpen}
    onRequestClose={() => setIsOpen(false)}
    contentLabel="Rule"
    parentSelector={() => document.querySelector("main")}
    id="rule-modal"
    ariaHideApp={false}
  >
    <CloseModalButton setIsOpen={setIsOpen} />
    <div className="modal-title">{parse(data?.title)}</div>
    <div className="modal-forum-text">{parse(data?.body)}</div>
  </Modal>
);

export const AddToHomepageModal = () => {
  const [modalOpen, setModalOpen] = useState(true);
  return (
    <Modal
      isOpen={modalOpen}
      onRequestClose={() => setModalOpen(false)}
      contentLabel="Add to homescreen"
      parentSelector={() => document.querySelector("main")}
      id="add-homepage-modal"
      ariaHideApp={false}
    >
      <CloseModalButton setIsOpen={setModalOpen} />
      <div className="modal-title">Add to homescreen</div>
      <div className="modal-forum-text">
        Would you like to add SlowDraft to your homescreen?
      </div>
      <div className="button-group">
        <button onClick={() => setModalOpen(false)}>Yup</button>
        <button onClick={() => setModalOpen(false)}>No thanks</button>
      </div>
    </Modal>
  );
};
