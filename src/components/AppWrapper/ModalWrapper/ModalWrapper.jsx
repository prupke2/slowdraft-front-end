import React, {useState} from 'react';
import Modal from 'react-modal';
import ReactHtmlParser from 'react-html-parser';
import { ToastsStore } from 'react-toasts';
import './ModalWrapper.css';
import { timeSince } from '../../../util/time';
import CloseModalButton from './CloseModalButton/CloseModalButton';
import NewPost from './NewPost/NewPost';
import { getDraft, getDBGoalies, getDBPlayers, getTeams } from '../../../util/requests';
import { getHeaders } from '../../../util/util';
import Loading from '../../Loading/Loading';

export default function ModalWrapper(
    { modalIsOpen, setIsOpen, data, modalType, sendChatAnnouncement, tableType, setTeams,
      setPicks, currentPick, setCurrentPick, setDraftingNow, setPlayers, setGoalies }
  ) {
  const [forumPostReplies, setForumPostReplies] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

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

  function draftPlayer(data) {
    setIsLoading(true);
    const isGoalie = data.position === 'G' ? true : false;
    const chatMessage = "The " + user.team_name + " have drafted " + data.name + ", " + data.position + " - " + data.team;
    fetch(`/draft/${data.player_id}`, {
      method: 'GET',
      headers: getHeaders()
    })
    .then(response => {
      if (!response.ok) {
        ToastsStore.error(`An error occurred. Please try again later.`)
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
      }
      return response.json()
    })
    .then(data => {
      console.log(`data: ${JSON.stringify(data, null, 4)}`);
      sendChatAnnouncement(chatMessage);
      getDraft(setPicks, setCurrentPick, setDraftingNow)
      getTeams(setTeams)
      isGoalie && getDBGoalies(setGoalies)
      !isGoalie && getDBPlayers(setPlayers)
      if (data.success !== true) {
        ToastsStore.error(`Error: ${data.error}`)
      } else {
        ToastsStore.success(`You have drafted ${data.player}. ${data.drafting_again}`)
      }
      setIsOpen(false);
      setIsLoading(false);
    })
  }
  
  if (modalType === 'draftPlayer') {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel='Player Draft'
        parentSelector={() => document.querySelector('main')}
        id='draft-player-modal'
        setPicks={setPicks}
        currentPick={currentPick}
        setCurrentPick={setCurrentPick}
        setDraftingNow={setDraftingNow}
        setPlayers={setPlayers}
        setTeams={setTeams}
        ariaHideApp={false}
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
          { isLoading &&
            <Loading alt={true} text='Drafting...' />
          }
          { !isLoading &&
            <>
              <button className="button-large" onClick={() => draftPlayer(data)}>Draft</button>
              <button className="button-large" onClick={() => setIsOpen(false)}>Cancel</button>
            </>
          }
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
  
  if (modalType === 'post' && tableType === 'forum') {
    return (
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={() => getReplies(data.id)}
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
