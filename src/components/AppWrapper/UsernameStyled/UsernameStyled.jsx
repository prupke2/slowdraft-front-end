import React from "react";
import "./UsernameStyled.css";
import { Link } from "react-router-dom";

export default function UsernameStyled({ username, color, teamId }) {
  const teams = JSON.parse(localStorage.getItem("teams"));
  return (
    <Link
      to={{
        pathname: `/teams`,
        state: { teamId: `${teamId}` },
      }}
      className="user-wrapper"
    >
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
          👤
        </span>
      )}
      <span className="user-in-draft">{username}</span>
    </Link>
  );
}
