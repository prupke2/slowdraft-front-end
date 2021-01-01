import React from 'react';
import { useEffect } from 'react';
import UsernameStyled from '../../UsernameStyled/UsernameStyled';

export default function MessageLog({messages}) {
  const chatbox = document.querySelector("ul#chat-messages");

  // Scroll to bottom of chatbox on load and when a new message comes in
  useEffect(() => {
    if (chatbox) { 
      chatbox.scrollTop = chatbox.scrollHeight;
    }
  });

  return(
    <ul id="chat-messages">
      <li>
        <div>
          { messages.map((item, index)=>(
            <div key={index}>
              { item.uuid !== '***' &&
                <>
                  <span role='img' aria-label='icon' style={{ 'background': item.color}}>👤</span>
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
