import React from 'react';
import { useEffect } from 'react';

export default function MessageLog({messages}) {
  const chatbox = document.querySelector("ul#chat-messages");

  // Scroll to bottom of chatbox on load and when a new message comes in
  useEffect(() => {
    console.log("typeof(chatbox): " + typeof(chatbox));
    if (chatbox) { 
      chatbox.scrollTop = chatbox.scrollHeight;
    }
  }, [messages]);

  return(
    <ul id="chat-messages">
      <li>
        <div>
          { messages.map((item, index)=>(
            <div key={index}>
              { item.uuid !== '***' &&
                <>
                  <span className="user">{item.uuid} </span>
                  <span className="message">{item.text}</span>
                </>
              }
              { item.uuid === '***' &&
                <span className="message chat-announcement">*** {item.text}</span>
              }
            </div>
          )) }
        </div>
      </li>
    </ul>
  )
};
