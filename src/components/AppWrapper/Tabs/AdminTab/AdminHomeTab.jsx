import React from "react";
import toast from "react-hot-toast";
import { API_URL, getHeaders } from "../../../../util/util";
import Emoji from "../../Emoji";

export default function AdminHomeTab() {
  localStorage.setItem("adminTab", "home");

  const refreshData = (e) => {
    e.preventDefault();
    const requestParams = {
      method: "GET",
      headers: getHeaders()
    }
    fetch(`${API_URL}/refresh_timestamps`, requestParams)
      .then((response) => {
        if (!response.ok) {
          toast.error(`An error occurred. Please try again later.`);
          const error = response.status;
          return Promise.reject(error);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success === true) {
          toast.success(`👍 Success! All users should now see the latest data.`);
        } else {
          toast.error(
            `There was an error refreshing data. ${
              data?.error ? data.error : null
            }`
          );
        }
      });
  }

  return (
    <form className="admin-form add-keeper-form">
      <div className="instructions">
        <div>
          <Emoji emoji="✨" />&nbsp;
          Use the refresh button if users are reporting not seeing the latest data.
          This will force the draft, team, and player data to update the next time they change tabs.
        </div>
      </div>
      <br />
      <button onClick={refreshData}>
        <Emoji emoji="🔄" />&nbsp;
        Refresh
      </button>
    </form>
  );
}
