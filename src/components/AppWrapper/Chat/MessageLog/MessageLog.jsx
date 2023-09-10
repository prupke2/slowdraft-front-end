import React from "react";
import { useEffect } from "react";
import UsernameStyled from "../../UsernameStyled/UsernameStyled";

export default function MessageLog({ messages, uniqueUserList }) {
  const chatbox = document.querySelector("ul#chat-messages");

  // Scroll to bottom of chatbox on initial load and when a new message comes in
  useEffect(() => {
    if (chatbox) {
      chatbox.scrollTop = chatbox.scrollHeight;
    }
  });
  console.log('messages:', messages);

  return (
    <ul id="chat-messages">
      <li>
        <div>
          {messages.map((item, index) => (
            <div key={index}>
              {(!item?.event && item.message) && (
                <UsernameStyled
                  username={item.username}
                  teamKey={item.teamKey}
                  color={item.color}
                  small={true}
                  message={item.message}
                />
                // <>
                //   <span
                //     className="user-icon narrow-icon"
                //     role="img"
                //     aria-label="icon"
                //     style={{ background: item.logo }}
                //   >
                //     <img className="user-icon narrow-icon" src={item.logo} alt="" />
                //   </span>
                //   <span className="user user-in-chat" style={{color: item.color}}>{item.user}</span>
                //   <span className="message">{item.message}</span>
                // </>
              )}
              {item?.event && (
                <span className="message chat-announcement">
                  *** {item.message}
                </span>
              )}
              {/* {(item?.status && uniqueUserList.indexOf(item.user) === 0) && (
                <span className="message chat-announcement">
                  *** {item.user} {item.status}
                </span>
              )} */}
            </div>
          ))}
        </div>
      </li>
    </ul>
  );
}
