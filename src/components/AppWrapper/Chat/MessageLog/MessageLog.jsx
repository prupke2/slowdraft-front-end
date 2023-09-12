import React from "react";
import { useEffect } from "react";
import UsernameStyled from "../../UsernameStyled/UsernameStyled";

export default function MessageLog({ messages, uniqueUserList }) {
  const chatbox = document.querySelector("ul.chatMessages");

  // Scroll to bottom of chatbox on initial load and when a new message comes in
  useEffect(() => {
    if (chatbox) {
      chatbox.scrollTop = chatbox.scrollHeight;
    }
  });

  return (
    <ul className="chatMessages">
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
              )}
              {item?.event && (
                <span className="message chat-announcement">
                  *** {item.message}
                </span>
              )}
            </div>
          ))}
        </div>
      </li>
    </ul>
  );
}
