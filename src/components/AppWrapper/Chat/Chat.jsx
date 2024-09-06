import React, { useState } from 'react';
import { useConnectionStateListener } from 'ably/react';
import "./Chat.css";
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';
import Loading from "../../Loading/Loading";
import Emoji from '../Emoji';
import CloseModalButton from '../ModalWrapper/CloseModalButton/CloseModalButton';
import MessageLog from './MessageLog/MessageLog';
import { useChannel, usePresenceListener } from 'ably/react';
import UsernameStyled from '../UsernameStyled/UsernameStyled';
import { delayFunc, removeDuplicatesUsers } from '../../../util/util';

export default function Chat(
  {
    chatStatus, 
    setChatStatus, 
    setChannel, 
    chatMessages, 
    setChatMessages,
    getLatestData,
    setIsUpdating,
  }
) {
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
    // if an "event" is set to chat, we need to check for updates
    if (message?.data?.event) {
      setIsUpdating(true);
      
      // delay before fetching to make sure the new data is available
      delayFunc(getLatestData, 1500);
      delayFunc(() => setIsUpdating(false), 2000);
    }
  });

  setChannel(channel);
  
  const { presenceData } = usePresenceListener(user.yahoo_league_id);
  const usersOnline = presenceData.map(msg => msg.data);
  const uniqueUsersOnline = removeDuplicatesUsers(usersOnline);
  const isMobileUser = window.screen.availWidth <= 800;
  const mobileCloseChat = isMobileUser && chatStatus === 'offline';
  const [chatOpen, setChatOpen] = useState(!isMobileUser);

  function handleKeyDown(event) {
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
    console.log('Connected to chat!');
    setChatStatus("online");
    channel.presence.subscribe('enter', (member) => {
      console.log('Member entered the chat: ', member);
    });
    channel.presence.subscribe('update', (member) => {
      console.log('Member update: ', member);
      console.log('user: ', user);
    });
    channel.presence.enter();
    if (user?.team_name) {
      channel.presence.update({
        name: user.team_name,
        color: user.color, 
        role: user.role, 
        logo: user.logo,
        teamKey: user.team_key,
      });
    }
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
              {uniqueUsersOnline.map((u) => (
                <UsernameStyled
                  key={u.teamKey}
                  username={u.name}
                  color={u.color}
                  teamKey={u.teamKey}
                  small
                  logoAndShortName
                />
              ))}
            </div>
            <CloseModalButton
              classes="closeChatButton"
              setIsOpen={setChatOpen}
            />
            <MessageLog 
              messages={chatMessages}
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
