import React, { useEffect, useState } from "react";
import MessageLog from "./MessageLog/MessageLog";
import "./Chat.css";
import ErrorBoundary from "../../ErrorBoundary/ErrorBoundary.jsx";
import { WEBSOCKET_URL } from "../../../util/util.jsx";
import { isEmpty } from "lodash";
import Loading from "../../Loading/Loading";
import CloseModalButton from "../ModalWrapper/CloseModalButton/CloseModalButton";
import Emoji from "../Emoji";

export default function Chat({ websocket, getLatestData }) {
  const [userList, setUserList] = useState([]);
  const cachedMessages = JSON.parse(localStorage.getItem("chatMessages"));
  const [messages, setMessages] = useState(cachedMessages || []);
  const [chatStatus, setChatStatus] = useState("connecting");
  const user = JSON.parse(localStorage.getItem("user"));
  const mobileUser = window.screen.availWidth <= 800;
  const [chatOpen, setChatOpen] = useState(!mobileUser);

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
        "username": user.team_name, 
        "teamKey": user.team_key,
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
    if (!websocket.current) {
      websocket.current = new WebSocket(`${WEBSOCKET_URL}?user=${user?.team_name}`,
      ['appProtocol', 'chat']
      );
    }
    const websocketCurrent = websocket.current;
    if (!websocketCurrent || isEmpty(websocketCurrent)) {
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

      console.log('websocketCurrent at close:', websocketCurrent);
      const reconnect = () => {
        for (let attempt = 1; attempt <= 3; attempt += 1 ) {
          setTimeout(() => {
            if (websocket.current.readyState === 1) {
              setChatStatus("online");
              console.log("connected!")
              return
            } else {
              console.log(`reconnecting... attempt # ${attempt}`);
              console.log('websocket.current:', websocket?.current);
              console.log('websocket.readyState:', websocket?.readyState);
              websocket.current = new WebSocket(`${WEBSOCKET_URL}?user=${user?.team_name}`,
              ['appProtocol', 'chat']
              );
            }
            websocket.current.onmessage = e => {
              const message = JSON.parse(e.data);
              console.log('websocket.current on connect:', websocket.current);
              if (message?.users) {
                setUserList(message.users)
              }
              setChatStatus("online");
              console.log("connected!")
              return;
            }           
          }, 10000 * attempt);
        }
      }
      setTimeout(() => {}, 1000);
      setChatStatus('reconnecting');
      reconnect();
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
	}, [websocket]);

	useEffect(() => {
    websocket.current.onmessage = e => {
      const message = JSON.parse(e.data);

      // If the user opens multiple tabs, don't announce each time they open and close them
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

  const chatBackgroundColor = chatStatus === "offline" ? '#dbdbdb' : 'white';
  const chatStatusToMessageMap = {
    'connecting': 'Connecting to chat...',
    'reconnecting': 'Attempting to reconnect to chat...',
    'offline': 'Error loading chat.',
  }
  const chatConnecting = ['connecting', 'reconnecting'].includes(chatStatus);
  const mobileCloseChat = mobileUser && chatStatus === 'offline';
  
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
                Online: <span>{uniqueUserList.join(", ")}</span>{" "}
                <CloseModalButton 
                  classes="closeChatButton"
                  setIsOpen={setChatOpen}
                />
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
      )}
    </ErrorBoundary>
  );
}
