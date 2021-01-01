import React, {useState} from 'react';
import Modal from 'react-modal';
import ReactHtmlParser from 'react-html-parser';
import { ToastsStore } from 'react-toasts';
import './ModalWrapper.css';
import { timeSince } from '../../../util/time';
import CloseModalButton from './CloseModalButton/CloseModalButton';
import NewPost from './NewPost/NewPost';

export default function ModalWrapper(
    { modalIsOpen, setIsOpen, data, modalType, teamName, sendChatAnnouncement, tableType }
  ) {
  const [forumPostReplies, setForumPostReplies] = useState('');

  function getReplies(post_id) {

    fetch(`/view_post_replies/${post_id}`)
    .then(res => res.json())
    .then(data => {
      setForumPostReplies(data.replies);
    })
  }

  function draftPlayer(data) {
    let message = "The " + teamName + " have drafted " + data.name + ", " + data.position + " - " + data.team

    const draftTab = document.getElementById('react-tabs-0');
    fetch(`/draft/${data.player_id}`)
    .then(async response => {
      const data = await response.json();
      if (!response.ok) {
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
      }
      setIsOpen(false);
      sendChatAnnouncement(message);
      draftTab.click();
    })
    .then(ToastsStore.success(`You have drafted ${data.name}`));
    ;
  }
  
  if (modalType === 'draftPlayer') {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel='Player Draft'
        parentSelector={() => document.querySelector('main')}
        id='draft-player-modal'
      >
        <CloseModalButton 
          setIsOpen={setIsOpen}
        />
        <div className='modal-title'>You are about to draft:</div>
        <div className='modal-player-info'>
          {typeof(data.team) !== 'undefined' &&
            <>
              <strong>{data.name}</strong>, {data.position} - {(data.team).toUpperCase()}
            </>
          }
        </div>
        <div className='button-group'>
          <button className="button-large" onClick={() => draftPlayer(data)}>Draft</button>
          <button className="button-large" onClick={() => setIsOpen(false)}>Cancel</button>
        </div>
      </Modal>
    );
  } 

  if (modalType === 'post' && tableType === 'rules') {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel='Rule'
        parentSelector={() => document.querySelector('main')}
        id='rule-modal'
      >
        <CloseModalButton 
          setIsOpen={setIsOpen}
        />
        <div className='modal-title'>{ReactHtmlParser(data.title)}</div>
        <div className='modal-forum-text'>{ReactHtmlParser(data.body)}</div>
      </Modal>
    );
  }
  
  if (modalType === 'post' && tableType === 'forum') {
    return (
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={() => getReplies(data.id)}
        onRequestClose={() => setIsOpen(false)}
        contentLabel='Forum Post'
        parentSelector={() => document.querySelector('main')}
        id='forum-post-modal'
      >
        <CloseModalButton 
          setIsOpen={setIsOpen}
        />
        <div className='modal-title'>{ReactHtmlParser(data.title)}</div>
        <span className='modal-forum-user'>
          {data.user} &nbsp;
          <div className='modal-forum-date'>{timeSince(data.create_date)}</div>
        </span>

        <div className='modal-forum-text'>{ReactHtmlParser(data.body)}</div>

        { forumPostReplies !== '' &&
          <div className='replies'>
            {forumPostReplies.map(reply =>
              <div key={reply.id} className="forum-reply">
                <span className='modal-forum-user'>
                  {reply.username} &nbsp;
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
      >
        <CloseModalButton 
          setIsOpen={setIsOpen}
        />
        <div className='modal-title'>New forum post</div>
        <NewPost 
          setIsOpen={setIsOpen}
          postType='new_forum_post'
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
      >
        <CloseModalButton 
          setIsOpen={setIsOpen}
        />
        <div className='modal-title'>New Rule</div>
        <NewPost
          setIsOpen={setIsOpen}
          postType='create_rule'
        />
      </Modal>
    );
  }
  return null;
}
