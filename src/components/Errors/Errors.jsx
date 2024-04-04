import React from "react";
import "./Errors.css";
import { toast } from "react-toastify";

export default function Errors({ error, errorInfo }) {
  if (error) {
    toast(`Oops an error occured. Please try again later.`);
  }
  return (
    <div>
      {error && <p className="errorRow">{error}</p>}
      {errorInfo && <p className="errorRow">{errorInfo.toString()}</p>}
    </div>
  );
}
