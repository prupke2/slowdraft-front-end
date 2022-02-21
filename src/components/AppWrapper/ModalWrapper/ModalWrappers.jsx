import React, { useState } from 'react';
import Modal from 'react-modal';
import ReactHtmlParser from 'react-html-parser';
import './ModalWrappers.css';
import { timeSince } from '../../../util/time';
import CloseModalButton from './CloseModalButton/CloseModalButton';
import NewPost from './NewPost/NewPost';
import { getHeaders } from '../../../util/util';
import UsernameStyled from '../UsernameStyled/UsernameStyled';
import { useEffect } from 'react';

export const ViewForumPost = ({ modalIsOpen, setIsOpen, post }) => {
  const [forumPostReplies, setForumPostReplies] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    if (!forumPostReplies) {
      fetch(`/view_post_replies/${post.id}`, {
        method: 'GET',
        headers: getHeaders()
      })
      .then(res => res.json())
      .then(data => {
        setForumPostReplies(data.replies);
      })
    }
  }, [forumPostReplies, setForumPostReplies, post.id])
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => setIsOpen(false)}
      contentLabel='Forum Post'
      parentSelector={() => document.querySelector('main')}
      id='forum-post-modal'
      ariaHideApp={false}
    >
      <CloseModalButton 
        setIsOpen={setIsOpen}
      />
      <div className='modal-title'>{ReactHtmlParser(post.title)}</div>
      <span className='modal-forum-user'>
        <UsernameStyled
          username={post.username}
          color={post.color}
          teamId={post.yahoo_team_id}
        />
        &nbsp;
        <div className='modal-forum-date'>{timeSince(post.create_date)}</div>
      </span>

      <div className='modal-forum-text'>{ReactHtmlParser(post.body)}</div>

      { forumPostReplies &&
        <div className='replies'>
          {forumPostReplies.map(reply =>
            <div key={reply.id} className="forum-reply">
              <span className='modal-forum-user'>
                <UsernameStyled
                  username={reply.username}
                  color={reply.color}
                  teamId={reply.yahoo_team_id}
                />
                &nbsp;
                <div className='modal-forum-date'>{timeSince(reply.create_date)}</div>
              </span>
              <div className='modal-forum-text'>
                {ReactHtmlParser(reply.body)}
              </div>
            </div>
          )}
        </div>
      }
      <NewPost 
        parentPostId={post.id}
        setIsOpen={setIsOpen}
        postType='new_forum_post'
        user={user}
      />
    </Modal>
  );
}

export const NewForumPost = ({ modalIsOpen, setIsOpen }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => setIsOpen(false)}
      contentLabel='New Forum Post'
      parentSelector={() => document.querySelector('main')}
      id='new-forum-post-modal'
      ariaHideApp={false}
    >
      <CloseModalButton 
        setIsOpen={setIsOpen}
      />
      <div className='modal-title'>New forum post</div>
      <NewPost 
        setIsOpen={setIsOpen}
        postType='new_forum_post'
        user={user}
      />
    </Modal>
  );
}

export const NewRuleModal = ({ modalIsOpen, setIsOpen, user }) =>
  <Modal
    isOpen={modalIsOpen}
    onRequestClose={() => setIsOpen(false)}
    contentLabel='New Rule'
    parentSelector={() => document.querySelector('main')}
    id='new-rule-modal'
    ariaHideApp={false}
    >
    <CloseModalButton 
      setIsOpen={setIsOpen}
    />
    <div className='modal-title'>New Rule</div>
    <NewPost
      setIsOpen={setIsOpen}
      postType='create_rule'
      user={user}
    />
  </Modal>

export const ViewRuleModal = ({ modalIsOpen, setIsOpen, data }) =>
  <Modal
    isOpen={modalIsOpen}
    onRequestClose={() => setIsOpen(false)}
    contentLabel='Rule'
    parentSelector={() => document.querySelector('main')}
    id='rule-modal'
    ariaHideApp={false}
  >
    <CloseModalButton 
      setIsOpen={setIsOpen}
    />
    <div className='modal-title'>{ReactHtmlParser(data?.title)}</div>
    <div className='modal-forum-text'>{ReactHtmlParser(data?.body)}</div>
  </Modal>
