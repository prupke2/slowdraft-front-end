import React, { useEffect, useState } from "react";
import MessageLog from "./MessageLog/MessageLog";
import "./Chat.css";
import ErrorBoundary from "../../ErrorBoundary/ErrorBoundary.jsx";
import { WEBSOCKET_URL } from "../../../util/util.jsx";

export default function Chat({ websocket, getLatestData }) {
  const [userList, setUserList] = useState([]);
  const cachedMessages = JSON.parse(localStorage.getItem("chatMessages"));
  const [messages, setMessages] = useState(cachedMessages || []);
  const [chatStatus, setChatStatus] = useState("connecting");
  const [reconnectChat, setReconnectChat] = useState(false);
  // const firefoxUser = navigator.userAgent.includes("Firefox");
  const user = JSON.parse(localStorage.getItem("user"));

  // function sleep(ms) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }

  // async function pingChat() {
  //   const pingMessage = {
  //     "user": user.team_name,
  //     "color": user.color, 
  //     "message": "ping"
  //   }
  //   console.log(pingMessage);
  //   // if (websocket.current) {
  //   //   await websocket.current.send(pingMessage);
  //   // }
  //   console.log('Sent!');
  // }
  // console.log(`In useEffect. chatStatus: ${chatStatus}`);

  // setInterval(() => {
  //   if (chatStatus === 'online') {
  //     pingChat();
  //   }
  // }, 5000);



  function sendMessage(msg) {
    const chatMessage = JSON.stringify(
      {
        "user": user.team_name,
        "color": user.color, 
        "message": msg
      }
    )
    websocket.current.send(chatMessage);
  }

	useEffect(() => {
    console.log(`chatStatus: ${chatStatus}`);

    if (chatStatus === 'online') {
      return
    }
    console.log(`connecting...`);

    setChatStatus('connecting');
    console.log(`websocket.current: ${JSON.stringify(websocket.current, null, 4)}`);
    if (!websocket.current) {
      websocket.current = new WebSocket(`${WEBSOCKET_URL}?user=${user?.team_name}`,
      ['appProtocol', 'chat']
      );
    }
    
    const websocketCurrent = websocket.current;
    if (!websocketCurrent) {
      setChatStatus("offline");
    }
    websocketCurrent.onopen = () => {
      console.log("Chat opened");
      setChatStatus("online");
    }
    websocketCurrent.onclose = (error) => {
      console.log("websocket closed.");
      console.log(`Code: ${error?.code}`);
      console.log(`Reason: ${error?.reason}`);

      setChatStatus("offline");
      // Chrome does not reconnect very well, better to have the user refresh
      // if (firefoxUser) {
      // console.log("reconnecting...")
      // setReconnectChat(true);
      // }
      setTimeout(setReconnectChat(true), 5000)
    }
    websocketCurrent.onerror = (error) => {
      console.log(`websocket error: ${JSON.stringify(error, null, 4)}`);
      console.log(`Code: ${error?.code}`);
      console.log(`Reason: ${error?.reason}`);
    }

    return () => {
      console.log("Closing websocket...")
      websocketCurrent.close();
    };
    // eslint-disable-next-line
	}, [reconnectChat, websocket]);

	useEffect(() => {
    websocket.current.onmessage = e => {
      const message = JSON.parse(e.data);

      // If the user opens multiple tabs, don't accounce each time they open and close them
      if (message?.status && userList.includes(message.user)) {
        return
      }
      if (message?.event === 'pickUpdated' || message?.event === 'playerDrafted') {
        getLatestData();
      }
      if (message?.users) {
        setUserList(message.users)
      }
      setMessages((messages) => messages.concat(message));
      localStorage.setItem("chatMessages", JSON.stringify(messages))
    };
  }, [messages, userList, websocket, getLatestData]);

  function handleKeyDown(event) {
    if (event.target.id === "messageInput") {
      if (event.key === "Enter") {
        sendMessage(event.target.value);
        event.target.value = ""
      }
    }
  }

  const uniqueUserList = userList.filter((e, i) => userList.indexOf(e) === i);

  const chatBackgroundColor = chatStatus === "online" ? 'white' : '#dbdbdb';
  const chatStatusToMessageMap = {
    'connecting': 'Reconnecting to chat...',
    'offline': 'Error loading chat.',
  } 

  return (
    <ErrorBoundary>
      <aside id="chatbox" style={{backgroundColor: chatBackgroundColor}}>

        { chatStatus !== 'online' &&
          <div className='chat-status-message'>
            {chatStatusToMessageMap[chatStatus]}
            { (chatStatus === 'offline') &&
              <button 
                className='button-large'
                onClick={setReconnectChat}
              >Reconnect  
              </button>
            }
          </div>
        }

        { chatStatus === 'online' &&
          <>
            <div id="user-list">
              Online: <span>{uniqueUserList.join(", ")}</span>{" "}
            </div>
            <MessageLog 
              messages={messages} 
              uniqueUserList={uniqueUserList}
            /> 
            <input
              placeholder="Enter a message..."
              id="messageInput"
              onKeyDown={handleKeyDown}
            />
          </>
        }
      </aside>
    </ErrorBoundary>
  );
}
