import React from "react";
import scoreboardLoading from "../../assets/scoreboardLoading.gif";
import gearsLoading from "../../assets/gearsLoading.gif";
import "./Loading.css";

export default function Loading({ text, absolute, small, alt }) {
  const absolutePositioning = absolute ? "absolute" : null;
  const loadingGif = alt === true ? gearsLoading : scoreboardLoading;
  const size = small ? 'loading-small' : null;
  return (
    <div className={`loading-wrapper ${absolutePositioning} ${size}`}>
      <div className="loading-text">{text}</div>
      <img src={loadingGif} alt="" />
    </div>
  );
}
