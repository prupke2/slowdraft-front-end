import React, { useState } from 'react';
import Modal from 'react-modal';
import ReactHtmlParser from 'react-html-parser';
import './ModalWrapper.css';
import { timeSince } from '../../../util/time';
import CloseModalButton from './CloseModalButton/CloseModalButton';
import NewPost from './NewPost/NewPost';
import { getHeaders } from '../../../util/util';
import UsernameStyled from '../UsernameStyled/UsernameStyled';

// This is a shared wrapper used by both the forum and rules tabs
export default function ModalWrapper({ modalIsOpen, setIsOpen, data, modalType, tableType }) {
  const [forumPostReplies, setForumPostReplies] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const teams = JSON.parse(localStorage.getItem('teams'));

  function getReplies(post_id) {
    fetch(`/view_post_replies/${post_id}`, {
      method: 'GET',
      headers: getHeaders()
    })
    .then(res => res.json())
    .then(data => {
      setForumPostReplies(data.replies);
    })
  }

  if (modalType === 'post' && tableType === 'rules') {
    return (
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
        <div className='modal-title'>{ReactHtmlParser(data.title)}</div>
        <div className='modal-forum-text'>{ReactHtmlParser(data.body)}</div>
      </Modal>
    );
  }

  function modalOpenHandler() {
    if (tableType === 'forum') {
      getReplies(data.id)
    }
  }
  
  if (modalType === 'post' && tableType === 'forum') {
    console.log(`data: ${JSON.stringify(data, null, 4)}`);
    return (
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={() => modalOpenHandler()}
        onRequestClose={() => setIsOpen(false)}
        contentLabel='Forum Post'
        parentSelector={() => document.querySelector('main')}
        id='forum-post-modal'
        ariaHideApp={false}
      >
        <CloseModalButton 
          setIsOpen={setIsOpen}
        />
        <div className='modal-title'>{ReactHtmlParser(data.title)}</div>
        <span className='modal-forum-user'>
          <div className="logo-wrapper">
            {/* <img className="logo" src={data && teams[data.yahoo_team_id - 1].team_logo} alt=''/> */}
          </div>
          {data.user} &nbsp;
          <div className='modal-forum-date'>{timeSince(data.create_date)}</div>
        </span>

        <div className='modal-forum-text'>{ReactHtmlParser(data.body)}</div>

        { forumPostReplies !== '' &&
          <div className='replies'>
            {forumPostReplies.map(reply =>
              <div key={reply.id} className="forum-reply">
                <span className='modal-forum-user'>
                  <div className="logo-wrapper">
                    <img className="logo" src={teams[reply.yahoo_team_id - 1].team_logo} alt=''/>
                  </div>
                  <UsernameStyled
                    username={reply.value}
                    color={reply.row.original.color}
                    teamId={reply.row.original.yahoo_team_id}
                  />
                  {/* {reply.username} &nbsp; */}
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
          parentPostId={data.id}
          setIsOpen={setIsOpen}
          postType='new_forum_post'
          user={user}
        />
      </Modal>
    );
  }

  if (modalType === 'newForumPost') {
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
        <div className='modal-player-info'>
          {typeof(data.team) !== 'undefined' &&
            <>
              <strong>{data.name}</strong>, {data.position} - {(data.team).toUpperCase()}
            </>
          }
        </div>
      </Modal>
    );
  } 

  if (modalType === 'newRule') {
    return (
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
    );
  }
  return null;
}
