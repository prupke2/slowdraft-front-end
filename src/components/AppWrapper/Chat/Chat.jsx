import React, { useEffect, useState, useRef } from "react";
import MessageLog from "./MessageLog/MessageLog";
import "./Chat.css";
import ErrorBoundary from "../../ErrorBoundary/ErrorBoundary.jsx";
import { WEBSOCKET_URL, getHeaders } from "../../../util/util.jsx";

export default function Chat() {
  const [userList, setUserList] = useState([]);
  const cachedMessages = JSON.parse(localStorage.getItem("chatMessages"));
  const [messages, setMessages] = useState(cachedMessages || []);
  const [chatStatus, setChatStatus] = useState("connecting");

  const user = JSON.parse(localStorage.getItem("user"));
	const ws = useRef(null);

	useEffect(() => {
    console.log(`chatStatus: ${chatStatus}`);
    if (chatStatus === 'online') {
      return null
    }

    ws.current = new WebSocket(`${WEBSOCKET_URL}?user=${user?.team_name}`,
      null,
      { headers: getHeaders() }
      );
    ws.current.onopen = () => {
      console.log("Chat opened");
      setChatStatus("online");
    }
    ws.current.onclose = () => {
      console.log("ws closed");
      setChatStatus("offline");
    }

    const wsCurrent = ws.current;

    return () => {
        wsCurrent.close();
    };
    // eslint-disable-next-line
	}, []);

	useEffect(() => {
			if (!ws.current) return;

			ws.current.onmessage = e => {
          const message = JSON.parse(e.data);
          if (message?.status) {
            // If the user opens multiple tabs, don't list them multiple times
            if (message.status === 'connected' && userList.includes(message.user)) {
              return
            }
          }
          if (message?.users) {
            setUserList(message.users)
          }
          console.log("e", message);
          setMessages((messages) => messages.concat(message));
          console.log(`messages: ${JSON.stringify(messages, null, 4)}`);
          localStorage.setItem("chatMessages", JSON.stringify(messages))
			};
  }, [messages, userList]);

  function sendMessage(msg) {
    const chatMessage = JSON.stringify(
      {
        "user": user.team_name,
        "color": user.color, 
        "message": msg
      }
    )
    ws.current.send(chatMessage);
	}


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
