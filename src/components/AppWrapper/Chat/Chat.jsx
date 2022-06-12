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

    websocket.current = new WebSocket(`${WEBSOCKET_URL}?user=${user?.team_name}`,
      null,
      { headers: getHeaders() }
      );
    websocket.current.onopen = () => {
      console.log("Chat opened");
      setChatStatus("online");
    }
    websocket.current.onclose = () => {
      console.log("websocket closed");
      setChatStatus("offline");
    }

    const websocketCurrent = websocket.current;

    return () => {
        websocketCurrent.close();
    };
    // eslint-disable-next-line
	}, []);

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

  const chatBackgroundColor = chatStatus === "online" ? 'white' : 'grey';
  return (
    <ErrorBoundary>
      <aside id="chatbox" style={{backgroundColor: chatBackgroundColor}}>
        <div id="user-list">
          Online: <span>{uniqueUserList.join(", ")}</span>{" "}
        </div>
        { chatStatus === 'connecting' &&
          <div>Connecting to chat...</div>
        }
        { chatStatus === 'offline' &&
          <div>Error loading chat</div>
        }
        { chatStatus === 'online' &&
          <>
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
