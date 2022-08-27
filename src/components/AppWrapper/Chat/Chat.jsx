import React, { useEffect, useState } from "react";
import MessageLog from "./MessageLog/MessageLog";
import "./Chat.css";
import ErrorBoundary from "../../ErrorBoundary/ErrorBoundary.jsx";
import { WEBSOCKET_URL, getHeaders } from "../../../util/util.jsx";

export default function Chat({ websocket }) {
  const [userList, setUserList] = useState([]);
  const cachedMessages = JSON.parse(localStorage.getItem("chatMessages"));
  const [messages, setMessages] = useState(cachedMessages || []);
  const [chatStatus, setChatStatus] = useState("connecting");
  const [reconnectChat, setReconnectChat] = useState(false);

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
  
	useEffect(() => {
    console.log(`chatStatus: ${chatStatus}`);
    if (chatStatus === 'online') {
      return null
    }
    setChatStatus('connecting');

    websocket.current = new WebSocket(`${WEBSOCKET_URL}?user=${user?.team_name}`,
      ['appProtocol', 'appProtocol-v2'],
      { headers: getHeaders() }
      );
    
    const websocketCurrent = websocket.current;
    
    websocketCurrent.onopen = () => {
      console.log("Chat opened");
      setChatStatus("online");
    }
    websocketCurrent.onclose = () => {
      console.log("websocket closed");
      setChatStatus("offline");
      setReconnectChat(true);
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
			if (!websocket.current) return;

			websocket.current.onmessage = e => {
          const message = JSON.parse(e.data);
          // If the user opens multiple tabs, don't accounce each time they open and close them
          if (message?.status && userList.includes(message.user)) {
            return
          }
          if (message?.users) {
            setUserList(message.users)
          }
          console.log("e", message);
          setMessages((messages) => messages.concat(message));
          localStorage.setItem("chatMessages", JSON.stringify(messages))
			};
  }, [messages, userList, websocket]);

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
    'offline': 'Error loading chat.',
  } 

  return (
    <ErrorBoundary>
      <aside id="chatbox" style={{backgroundColor: chatBackgroundColor}}>

        { chatStatus !== 'online' &&
          <div className='chat-status-message'>
            {chatStatusToMessageMap[chatStatus]}
            { chatStatus === 'offline' &&
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
            <MessageLog messages={messages} /> 
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
