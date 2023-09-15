import React from "react";
import "./UsernameStyled.css";
import { Link } from "react-router-dom";
import { teamKeyToID, firstLetterOfEachWord } from "../../../util/util";

export default function UsernameStyled({ username, color, teamKey, small, message }) {
  const teams = JSON.parse(localStorage.getItem("teams"));
  const smallUsernameStyling = small && 'small-username';
  const autoHeight = message && 'auto-height';
  const teamId = teamKeyToID(teamKey);
  const teamLogo = teams[teamId - 1]?.team_logo;
  const name = teams[teamId - 1]?.user;
  const nameAcronym = username ? firstLetterOfEachWord(username) : name;

  return (
    <div className={`user-wrapper ${smallUsernameStyling} ${autoHeight}`}>
      <Link
        to={{
          pathname: `/teams`,
          state: { teamId: `${teamId}` },
        }}
      >
        {teamId && teams && (
          <img
            className="user-logo"
            src={teamLogo || null}
            alt="👤"
            title={`${username} (${name})`}
          />
        )}
        {!teamId && (
          <span
            role="img"
            aria-label="icon"
            className="user-icon"
            style={{ background: color }}
          >
          </span>
        )}
        { !message &&
          <span className="user-in-draft">{username}</span>
        }
      </Link>
      { message && (
        <div className="chat-message">
          <span 
            className="chat-name"
            title={`${username} (${name})`}
          >{nameAcronym}</span>
          : {message}
        </div> 
      )}
    </div>
  );
}
