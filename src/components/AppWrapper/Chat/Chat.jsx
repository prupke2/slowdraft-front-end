import React, { useEffect, useState } from "react";
import useInput from "./useInput.js";
import PubNub from "pubnub"; // backend for chat component
import MessageLog from "./MessageLog/MessageLog";
import "./Chat.css";
import ErrorBoundary from "../../ErrorBoundary/ErrorBoundary.jsx";
import { substringInString } from "../../../util/util.jsx";

export default function Chat({
  messages,
  setMessages,
  pub,
  sub,
  user,
  channel,
  getLatestData,
  sendChatAnnouncement,
}) {
  const [userList, setUserList] = useState([]);
  const tempMessage = useInput();

  useEffect(() => {
    console.log("setting up chat");
    const pubnub = new PubNub(
      {
        publishKey: pub,
        subscribeKey: sub,
        uuid: user.team_name,
      },
      [user]
    );
    const userInfo = JSON.parse(localStorage.getItem("user"));
    setUserList((userList) => [...userList, userInfo.team_name]);

    pubnub.addListener({
      status: function (statusEvent) {
        if (statusEvent.category === "PNConnectedCategory") {
          sendChatAnnouncement(`New sign in! ${userInfo.team_name}`);
          console.log("Connected to chat!");
        }
      },
      message: function (msg) {
        const newMessage = msg.message.text;
        const newSignIn = substringInString(newMessage, "New sign in! ");
        if (newSignIn) {
          const team = newMessage.replace("New sign in! ", "");
          setUserList((userList) => [...userList, team]);
        }

        if (msg.message.text && !newSignIn) {
          console.log(msg.message.text);
          let newMessages = [];
          newMessages.push({
            uuid: msg.message.uuid,
            text: msg.message.text,
            color: msg.message.color,
          });
          setMessages((messages) => messages.concat(newMessages));
          if (
            substringInString(newMessage, " have updated pick ") ||
            substringInString(newMessage, " have drafted ")
          ) {
            getLatestData(true, userInfo);
          }
        }
      },
    });

    pubnub.hereNow(
      {
        channels: [channel],
        includeUUIDs: true,
        includeState: true,
      },
      (status, response) => {
        if (status.statusCode === 200) {
          const currentUsers = response.channels[channel].occupants;
          currentUsers.forEach((currentUser) => {
            if (
              currentUser.uuid !== "announcement" &&
              !substringInString(currentUsers.uuid, "pn-")
            ) {
              setUserList((userList) => [...userList, currentUser.uuid]);
            }
          });
        }
      }
    );

    pubnub.subscribe({
      channels: [channel],
    });

    pubnub.history(
      {
        channel: channel,
        count: 500, // 100 is the default
        stringifiedTimeToken: true, // false is the default
      },
      function (status, response) {
        if (status.statusCode === 200) {
          let newMessages = [];
          for (let i = 0; i < response.messages.length; i++) {
            const msg = response.messages[i].entry;
            if (!substringInString(msg.text, "New sign in! ")) {
              newMessages.push({
                uuid: msg.uuid,
                text: msg.text,
                color: msg.color,
              });
            }
          }
          setMessages((messages) => messages.concat(newMessages));
        } else {
          setMessages([
            {
              uuid: "",
              text: "Error connecting to chat. Try refreshing the page.",
              color: "red",
            },
          ]);
        }
      }
    );
    return function cleanup() {
      console.log("closing chat");
      // sendChatAnnouncement(`User leaving chat! ${userInfo.team_name}`);
      pubnub.unsubscribeAll();
      setMessages([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleKeyDown(event) {
    if (event.target.id === "messageInput") {
      if (event.key === "Enter") {
        publishMessage();
      }
    }
  }

  // Publishing messages via PubNub
  function publishMessage() {
    if (tempMessage.value) {
      let messageObject = {
        text: tempMessage.value,
        uuid: user.team_name,
        color: user.color,
      };
      const pubnub = new PubNub({
        publishKey: pub,
        subscribeKey: sub,
        uuid: user.team_name,
      });
      pubnub.publish({
        message: messageObject,
        channel: channel,
      });
      tempMessage.setValue("");
    }
  }

  const uniqueUserList = userList.filter((e, i) => userList.indexOf(e) === i);

  return (
    <ErrorBoundary>
      {pub !== "" && sub !== "" && (
        <aside id="chatbox">
          {/* <h3 id="chat-title">League Chat</h3> */}
          <div id="user-list">
            Online: <span>{uniqueUserList.join(", ")}</span>{" "}
          </div>
          <MessageLog messages={messages} />
          <input
            placeholder="Enter a message..."
            id="messageInput"
            value={tempMessage.value}
            onChange={tempMessage.onChange}
            onKeyDown={handleKeyDown}
          />
        </aside>
      )}
      {(!pub || !sub) && <div>Error loading chat.</div>}
    </ErrorBoundary>
  );
}
