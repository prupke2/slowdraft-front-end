import React, {useState} from 'react';
import Modal from 'react-modal';
import ReactHtmlParser from 'react-html-parser';
import { ToastsStore } from 'react-toasts';
import './ModalWrapper.css';
import { timeSince } from '../../../util/time';
import CloseModalButton from './CloseModalButton/CloseModalButton';
import NewForumPost from './NewForumPost/NewForumPost';


export default function ModalWrapper({modalIsOpen, setIsOpen, data, modalType}) {
  const [forumPostReplies, setForumPostReplies] = useState('');

  function getReplies(post_id) {
    fetch(`/view_post_replies/${post_id}`)
    .then(res => res.json())
    .then(data => {
      setForumPostReplies(data.replies);
    })
  }

  function draftPlayer(data) {
    fetch(`/draft/${data.player_id}`)
    .then(async response => {
      const data = await response.json();
      if (!response.ok) {
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
      }
      setIsOpen(false);
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
  
  if (modalType === 'forumPost') {
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
        <NewForumPost 
          parentPostId={data.id}
          setIsOpen={setIsOpen}
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
        <NewForumPost 
          setIsOpen={setIsOpen}
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
  return null;
}
