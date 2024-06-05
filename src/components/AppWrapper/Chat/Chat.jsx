import React, { useState } from 'react';
import { useConnectionStateListener } from 'ably/react';
import "./Chat.css";
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';
import Loading from "../../Loading/Loading";
import Emoji from '../Emoji';
import CloseModalButton from '../ModalWrapper/CloseModalButton/CloseModalButton';
import MessageLog from './MessageLog/MessageLog';
import { useChannel } from 'ably/react';

export default function Chat({ chatStatus, setChatStatus, setChannel, chatMessages, setChatMessages }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const chatBackgroundColor = chatStatus === "offline" ? '#dbdbdb' : 'white';
  const chatStatusToMessageMap = {
    'connecting': 'Connecting to chat...',
    'reconnecting': 'Attempting to reconnect to chat...',
    'offline': 'Error loading chat.',
  }
  const chatConnecting = ['connecting', 'reconnecting'].includes(chatStatus);
  const { channel } = useChannel(user.yahoo_league_id, user.team_name, (message) => {
    setChatMessages(previousMessages => [...previousMessages, message]);
  });
  setChannel(channel);

  const uniqueUserList = [];
  const isMobileUser = window.screen.availWidth <= 800;
  const mobileCloseChat = isMobileUser && chatStatus === 'offline';
  const [chatOpen, setChatOpen] = useState(!isMobileUser);

  function handleKeyDown(event) {
    console.log('event: ', event);
    
    if (event.target.id === "messageInput") {
      if (event.key === "Enter") {
        channel.publish(user.team_name, {
          message: event.target.value,
          teamKey: user.team_key,
          color: user.color,
        });
        event.target.value = ""
      }
    }
  }

  useConnectionStateListener('connected', () => {
    console.log('Connected to Ably!');
    setChatStatus("online");
  });

  return (
    <ErrorBoundary>
    { !chatOpen && chatStatus === 'online' && 
      <button
        className="openChatButton"
        onClick={() => setChatOpen(true)}
      >
        <Emoji 
          emoji="💬"
          variant="small-caps"
        />
        <div>chat</div>
      </button>
    }
    { chatOpen && !mobileCloseChat && (
      <aside className="chatbox" style={{backgroundColor: chatBackgroundColor}}>

        { chatStatus === 'offline' &&
          <div className='chat-status-message'>
            <CloseModalButton 
              classes="closeChatButton"
              setIsOpen={setChatOpen}
            />
            {chatStatusToMessageMap[chatStatus]}
          </div>
        }
        { chatConnecting && (
          <Loading 
            alt
            text={chatStatusToMessageMap[chatStatus]}
          />
        )}
        { chatStatus === 'online' &&
          <>
            <div id="user-list">
              {/* TODO: add user list */}
              Online: <span>{uniqueUserList.join(", ")}</span>{" "}
            </div>
            <CloseModalButton
              classes="closeChatButton"
              setIsOpen={setChatOpen}
            />
            <MessageLog 
              messages={chatMessages} 
              uniqueUserList={[]}
            /> 
            <input
              placeholder="Enter a message..."
              id="messageInput"
              onKeyDown={handleKeyDown}
            />
          </>
        }
      </aside>
    )}
    </ErrorBoundary>
  );
}
