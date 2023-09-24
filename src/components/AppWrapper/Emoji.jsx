import React from "react";
import "./AppWrapper.css";

export default function Emoji({ emoji, navbar, ariaLabel=null }) {
  const navbarClass = navbar ? "navbar-emoji" : null;
  const emptyStarClass = emoji === '★' && 'empty-star';
  return (
    <span className={`${navbarClass} ${emptyStarClass}`} role="img" aria-label={ariaLabel}>
      {emoji}
    </span>
  );
}
