import React from "react";
import { useEffect } from "react";
import UsernameStyled from "../../UsernameStyled/UsernameStyled";

export default function MessageLog({ messages }) {
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
              {(!item?.data.event && item.data.message) && (
                <UsernameStyled
                  username={item.name}
                  teamKey={item.data.teamKey}
                  color={item.data.color}
                  small={true}
                  message={item.data.message}
                />
              )}
              {item?.data.event && (
                <span className="message chat-announcement">
                  *** {item.data.message}
                </span>
              )}
            </div>
          ))}
        </div>
      </li>
    </ul>
  );
}
