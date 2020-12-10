import React, { useState, useEffect } from 'react';
import Navbar from './Navbar/Navbar';
import useInput from '../../useInput.js';
import PubNub from 'pubnub'; // backend for chat component

export default function AppWrapper({logout, pub, sub}) {
  const [messages,setMessages] = useState([]);
  // Messages, a message adding buffer, channel, username, and
  // temp channel and message using the useInput hook. You can access what the
  // user is currently typing with those hooks.
  const tempChannel = useInput();
  const tempMessage = useInput();
  let defaultChannel = "Global";
  const [channel,setChannel] = useState(defaultChannel);
  const [username,] = useState(['user', new Date().getTime()].join('-'));

    //Set a default channel incase someone navigates to the base url without
  //specificfying a channel name parameter.

  //Access the parameters provided in the URL
  let query = window.location.search.substring(1);
  let params = query.split("&");
  for(let i = 0; i < params.length;i++){
    var pair = params[i].split("=");
    //If the user input a channel then the default channel is now set
    //If not, we still navigate to the default channel.
    if(pair[0] === "channel" && pair[1] !== ""){
      defaultChannel = decodeURI(pair[1]);
    }
  }

  // Adds back browser button listener
  useEffect(() => {
    window.addEventListener("popstate",goBack);

    return function cleanup(){
      window.removeEventListener("popstate",goBack);
    }
  },[]);

  // Set up PubNub to handle events that come through. Reruns on channel name update!
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

    // Subscribes to the channel in our state
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
    }else if(event.target.id === "channelInput"){
      if (event.key === 'Enter') {
        // Navigates to new channels
        const newChannel = tempChannel.value.trim();
        if(newChannel){
          if(channel !== newChannel){
            // If the user isnt trying to navigate to the same channel theyre on
            setChannel(newChannel);
            let newURL = window.location.origin + "?channel=" + newChannel;
            window.history.pushState(null, '',newURL);
            tempChannel.setValue('');
          }
        }else{
          // If the user didnt put anything into the channel Input
          if(channel !== "Global"){
            //If the user isnt trying to navigate to the same channel they are on
            setChannel("Global");
            let newURL = window.location.origin;
            window.history.pushState(null, '',newURL);
            tempChannel.setValue('');
          }
        }
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

  function goBack() {
    //Access the parameters provided in the URL
    let query = window.location.search.substring(1);
    if(!query){
      setChannel("Global")
    }else{
      let params = query.split("&");
      for(let i = 0; i < params.length;i++){
        var pair = params[i].split("=");
        //If the user input a channel then the default channel is now set
        //If not, we still navigate to the default channel.
        if(pair[0] === "channel" && pair[1] !== ""){
            setChannel(decodeURI(pair[1]))
        }
      }
    }
  }


  //Log functional component that is the list of messages
  function Log(props) {
    return(
      <ul id="chat-messages">
        <li>
          <div>
            { props.messages.map((item, index)=>(
              <div key={index}>
                <span className="user">{item.uuid}: </span>
                <span className="message">{item.text}</span>
              </div>
            )) }
          </div>
        </li>
      </ul>
    )
  };

  return (
    <React.Fragment>
      <Navbar />
      <button class="button" id="logout" onClick={logout}>Logout</button>
      <div id="chatbox">
        <Log messages={messages}/>
        <input
          placeholder="Enter a message"
          id="messageInput"
          value={tempMessage.value}
          onChange={tempMessage.onChange}
          onKeyDown={handleKeyDown}
          autoFocus={true}
        />
      </div>
    </React.Fragment>
  );
}
