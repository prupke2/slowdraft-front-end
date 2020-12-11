import React, { useState, useEffect } from 'react';
import useInput from './useInput.js';
import PubNub from 'pubnub'; // backend for chat component
import MessageLog from './MessageLog/MessageLog';
import './Chat.css';

export default function Chat({pub, sub}) {

  console.log("pub: " + pub + ", sub: " + sub);

  const [messages, setMessages] = useState([]);
  const tempMessage = useInput();
  const channel = "Global2" // To reset messages, update the channel name to something new
  const [username, setUsername] = useState(['anon', new Date().getTime()].join('-'));

  useEffect(()=>{
    console.log("setting up chat");
    const pubnub = new PubNub({
      publishKey: pub,
      subscribeKey: sub,
      uuid: username
    });

    pubnub.addListener({
      status: function(statusEvent) {
        if (statusEvent.category === "PNConnectedCategory") {
          console.log("Connected to chat!")
        }
      },
      message: function(msg) {
        if(msg.message.text){
          console.log(msg.message.text)
          let newMessages = [];
          newMessages.push({
            uuid:msg.message.uuid,
            text: msg.message.text
          });
          setMessages(messages=>messages.concat(newMessages))
        }
      }
    });

    pubnub.subscribe({
      channels: [channel]
    });

    pubnub.history(
    {
        channel: channel,
        count: 10, // 100 is the default
        stringifiedTimeToken: true // false is the default
    }, function (status, response){
      let newMessages = [];
        for (let i  = 0; i < response.messages.length;i++){
          newMessages.push({
            uuid:response.messages[i].entry.uuid ,
            text: response.messages[i].entry.text
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
  },[channel, username, pub, sub]);

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
        uuid: username
      };
  
      const pubnub = new PubNub({
          publishKey: pub,
          subscribeKey: sub,
          uuid: username
        });
      pubnub.publish({
        message: messageObject,
        channel: channel
      });
      tempMessage.setValue('');
    }
  }

  return (
    <React.Fragment>
      { (pub !== '' && sub !== '') && (
        <aside id="chatbox">
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
    </React.Fragment>
  )
}
