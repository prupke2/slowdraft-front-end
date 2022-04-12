import React from "react";
import "./Errors.css";
import { ToastsStore } from "react-toasts";

export default function Errors({ error, errorInfo }) {
  if (error) {
    ToastsStore.error(`Oops an error occured. Please try again later.`);
  }
  return (
    <div>
      {error && <p className="errorRow">{error}</p>}
      {errorInfo && <p className="errorRow">{errorInfo.toString()}</p>}
    </div>
  );
}
