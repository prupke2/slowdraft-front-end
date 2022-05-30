import React from "react";
import { useEffect } from "react";

export default function MessageLog({ messages }) {
  const chatbox = document.querySelector("ul#chat-messages");

  // Scroll to bottom of chatbox on initial load and when a new message comes in
  useEffect(() => {
    if (chatbox) {
      chatbox.scrollTop = chatbox.scrollHeight;
    }
  });

  return (
    <ul id="chat-messages">
      <li>
        <div>
          {messages.map((item, index) => (
            <div key={index}>
              {item.message && (
                <>
                  <span
                    className="user-icon narrow-icon"
                    role="img"
                    aria-label="icon"
                    style={{ background: item.color }}
                  >
                    👤
                  </span>
                  <span className="user user-in-chat">{item.user} </span>
                  <span className="message">{item.message}</span>
                </>
              )}
              {item?.status && (
                <span className="message chat-announcement">
                  *** {item.user} {item.status}
                </span>
              )}
            </div>
          ))}
        </div>
      </li>
    </ul>
  );
}
