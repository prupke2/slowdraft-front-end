import React, { useEffect, useState } from "react";
import MessageLog from "./MessageLog/MessageLog";
import "./Chat.css";
import ErrorBoundary from "../../ErrorBoundary/ErrorBoundary.jsx";
import { WEBSOCKET_URL, sleep } from "../../../util/util.jsx";
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

  const reconnect = async () => {
    const retry = () => {
      if (websocket?.current?.readyState === 1) {
        setChatStatus("online");
        console.log("connected!")
        return;
      } else if (websocket?.current?.readyState === 3) {
        console.log(`attempting to reconnect...`);
        console.log('websocket.current:', websocket?.current);
        console.log('websocket.readyState:', websocket?.readyState);
        websocket.current = new WebSocket(`${WEBSOCKET_URL}?user=${user?.team_name}`,
        ['appProtocol', 'chat']
        );
      } else if (websocket?.current?.readyState === 0) {
        console.log(`websocket is connecting still, will wait before retrying.`);
      } else if (websocket?.current?.readyState === 2) {
        console.log(`old websocket is closing still, will wait before retrying.`);
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
    }
    retry();
    await sleep(5000);
    retry();
    await sleep(10000);
    retry();
    await sleep(20000);
    retry();
    await sleep(40000);
    retry();
    setChatStatus("offline");
  };

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
    if (!websocket.current || websocket?.current?.readyState === 3) {
      websocket.current = new WebSocket(`${WEBSOCKET_URL}?user=${user?.team_name}`,
      ['appProtocol', 'chat']
      );
    }
    const websocketCurrent = websocket.current;

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
      if (message?.status || message?.users) {
        setUserList(message.users);
      } else if (message?.event === 'pickUpdated' || message?.event === 'playerDrafted') {
        getLatestData();
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
              </div>
              <CloseModalButton 
                classes="closeChatButton"
                setIsOpen={setChatOpen}
              />
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
