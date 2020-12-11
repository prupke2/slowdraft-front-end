import React from 'react';

export default function MessageLog(props) {
  return(
    <ul id="chat-messages">
      <li>
        <div>
          { props.messages.map((item, index)=>(
            <div key={index}>
              <span className="user">{item.uuid}: </span>
              <span className="message">{item.text}</span>
            </div>
          )) }
        </div>
      </li>
    </ul>
  )
};
