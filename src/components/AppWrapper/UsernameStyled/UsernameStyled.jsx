import React from "react";
import "./UsernameStyled.css";
import { Link } from "react-router-dom";
import Emoji from "../Emoji";

export default function UsernameStyled({ username, color, teamId }) {
  const teams = JSON.parse(localStorage.getItem("teams"));
  return (
    <div className="user-wrapper">
      {teamId && teams && (
        <img
          className="user-logo"
          src={teams[teamId - 1].team_logo || null}
          alt="👤"
        />
      )}
      {!teamId && (
        <span
          role="img"
          aria-label="icon"
          className="user-icon"
          style={{ background: color }}
        >
          <Link
            to={{
              pathname: `/teams`,
              state: { teamId: `${teamId}` },
            }}
          >
            <Emoji emoji="👤" />
          </Link>
        </span>
      )}
      <span className="user-in-draft">{username}</span>
    </div>
  );
}
