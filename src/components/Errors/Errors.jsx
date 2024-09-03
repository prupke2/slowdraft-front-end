import React, { useState } from "react";
import Emoji from "../AppWrapper/Emoji";
import "./Errors.css";

const Errors = ({ error, errorInfo, positionAbsolute }) => {
  const [expanded, setExpanded] = useState(false);
  const wrapperStyle = positionAbsolute ? { position: 'absolute'} : undefined;
  return (
    <div style={wrapperStyle}>
      <div className="errorRow">
        <Emoji emoji="⚠️" />&nbsp;Oops, an error occured.
      </div>
      <span className="errorText">
        {error?.toString()}
      </span>
      <div className="errorRow">
        Try clicking to refresh below. If the error persists, change tabs and then refresh again.
      </div>
      { errorInfo && (
        <div className="errorInfo">
          <span
            className="stackTrace"
            onClick={() => setExpanded(!expanded)}
          >
            Show stacktrace&nbsp;
            <Emoji emoji={expanded ? '⬇️' : '➡️' } />
          </span>
          { expanded && (
            <div>
              {JSON.stringify(errorInfo, {}, 4)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Errors;
