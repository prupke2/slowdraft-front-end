import React, { useEffect } from 'react';
import useInput from './useInput.js';
import PubNub from 'pubnub'; // backend for chat component
import MessageLog from './MessageLog/MessageLog';
import './Chat.css';
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary.jsx';

export default function Chat({messages, setMessages, pub, sub, user, channel, getLatestData}) {

  const tempMessage = useInput();
  
  useEffect(()=>{
    console.log("setting up chat");
    const pubnub = new PubNub({
      publishKey: pub,
      subscribeKey: sub,
      uuid: user.team_name
    }, [user]);

    pubnub.addListener({
      status: function(statusEvent) {
        if (statusEvent.category === "PNConnectedCategory") {
          console.log("Connected to chat!")
        }
      },
      message: function(msg) {
        const userInfo = JSON.parse(localStorage.getItem('user'));
        const newMessage = msg.message.text;

        if(msg.message.text){
          console.log(msg.message.text)
          let newMessages = [];
          newMessages.push({
            uuid: msg.message.uuid,
            text: msg.message.text,
            color: msg.message.color
          });
          setMessages(messages=>messages.concat(newMessages))
          if (newMessage.indexOf(' have updated pick ') !== -1 || (newMessage.indexOf(' have drafted ') !== -1)) {
            getLatestData(true, userInfo);
          }
        }
      }
    });

    pubnub.subscribe({
      channels: [channel]
    });

    pubnub.history(
    {
        channel: channel,
        count: 500, // 100 is the default
        stringifiedTimeToken: true // false is the default
    }, function (status, response) {
      // console.log("status: " + JSON.stringify(status, null, 4));
     
      let newMessages = [];
        for (let i  = 0; i < response.messages.length;i++){
          newMessages.push({
            uuid:response.messages[i].entry.uuid,
            text: response.messages[i].entry.text,
            color: response.messages[i].entry.color
          });
        }
        setMessages(messages=>messages.concat(newMessages));
      }
    );
    return function cleanup(){
      console.log("closing chat");
      pubnub.unsubscribeAll();
      setMessages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleKeyDown(event){
    if(event.target.id === "messageInput"){
      if (event.key === 'Enter') {
        publishMessage();
      }
    }
  }

  // Publishing messages via PubNub
  function publishMessage(){
    if (tempMessage.value) {
      let messageObject = {
        text: tempMessage.value,
        uuid: user.team_name,
        color: user.color
      };
      const pubnub = new PubNub({
          publishKey: pub,
          subscribeKey: sub,
          uuid: user.team_name
        });
      pubnub.publish({
        message: messageObject,
        channel: channel
      });
      tempMessage.setValue('');
    }
  }

  return (
    <ErrorBoundary>
      { (pub !== '' && sub !== '') && (
        <aside id="chatbox">
          <h3 id="chat-title">League Chat</h3>
          <MessageLog
            messages={messages}
          />
          <input
            placeholder='Enter a message...'
            id='messageInput'
            value={tempMessage.value}
            onChange={tempMessage.onChange}
            onKeyDown={handleKeyDown}
          />
        </aside>
        )
      }
      { (!pub || !sub) &&
        <div>Error loading chat.</div>
      }
    </ErrorBoundary>
  )
}
