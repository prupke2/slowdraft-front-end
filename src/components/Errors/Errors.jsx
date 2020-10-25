import React from 'react';
import './Errors.css';

export default function Errors(props) {
  return(
    <div>
      <p className="errorRow">Error code: 
        <span className="errorText">
          &nbsp;{props.code}
        </span>
      </p>
      <p className="errorRow">
        <span className="errorText">
          &nbsp;{props.message}
        </span>      
      </p>
    </div>
  )
}
