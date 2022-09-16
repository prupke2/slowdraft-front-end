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
  const firefoxUser = navigator.userAgent.includes("Firefox");
  const user = JSON.parse(localStorage.getItem("user"));

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

  const getNewWebSocket = () => new WebSocket(
    `${WEBSOCKET_URL}?user=${user?.team_name}`,
    ['appProtocol', 'chat']
  );

  
	useEffect(() => {
    console.log(`chatStatus: ${chatStatus}`);

    if (chatStatus === 'online') {
      return null
    }
    console.log(`connecting...`);

    setChatStatus('connecting');

    websocket.current = getNewWebSocket();
    
    const websocketCurrent = websocket.current;
    
    websocketCurrent.onopen = () => {
      console.log("Chat opened");
      setChatStatus("online");
    }
    websocketCurrent.onclose = () => {
      console.log("websocket closed.");

      setChatStatus("offline");
      // Chrome does not reconnect very well, better to have the user refresh
      // if (firefoxUser) {
      //   console.log("reconnecting...")
      //   setReconnectChat(true);
      // }
      websocket.current = null
      setTimeout(getNewWebSocket, 5000)
    }
    websocketCurrent.onerror = (error) => {
      console.log(`websocket error: ${JSON.stringify(error, null, 4)}`);
    }

    return () => {
      console.log("Closing websocket...")
      websocketCurrent.close();
    };
    // eslint-disable-next-line
	}, [websocket, reconnectChat]);

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
    'connecting': 'Connecting to chat...',
    'offline': firefoxUser ? 'Error loading chat.' : 'Chat and live sync disconnected. Please refresh the page.',
  } 

  return (
    <ErrorBoundary>
      <aside id="chatbox" style={{backgroundColor: chatBackgroundColor}}>

        { chatStatus !== 'online' &&
          <div className='chat-status-message'>
            {chatStatusToMessageMap[chatStatus]}
            { (chatStatus === 'offline' && firefoxUser) &&
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
