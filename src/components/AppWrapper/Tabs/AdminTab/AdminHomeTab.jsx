import React, { useState } from "react";
import toast from "react-hot-toast";
import { API_URL, getHeaders } from "../../../../util/util";
import Emoji from "../../Emoji";

export default function AdminHomeTab() {
  localStorage.setItem("adminTab", "home");
  const [isSpinning, setIsSpinning] = useState(false);
  const [userDraftingStatus, setUserDraftingStatus] = useState([]);

  function getUserDraftingStatus(e) {
    e.preventDefault();
    fetch(`${API_URL}/get_user_drafting_status`, {
      method: "GET",
      headers: getHeaders()
    })
      .then((response) => {
        if (!response.ok) {
          const error = response.status;
          return Promise.reject(error);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success === true) {
          if (data.users && data.users.length > 0) {
            setUserDraftingStatus(data.users);
          } else {
            setUserDraftingStatus([]);
          }
        } else {
          toast.error("Error fetching currently drafting users.");
        }
      });
  }

  const refreshData = (e) => {
    setIsSpinning(true);
    e.preventDefault();
    const requestParams = {
      method: "GET",
      headers: getHeaders()
    }
    fetch(`${API_URL}/refresh_timestamps`, requestParams)
      .then((response) => {
        // Remove spinning class after animation completes
        setTimeout(() => {
          setIsSpinning(false);
        }, 1000);
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
      }
    );
  }

  const handleDraftingStatusChange = (teamKey, username, newStatus) => {
    try {
      // Update the drafting status in the backend
      updateUserDraftingStatus(teamKey, newStatus);
      // Update the local state
      setUserDraftingStatus(prevUsers => 
        prevUsers.map(user => 
          user.team_key === teamKey 
            ? { ...user, drafting_now: newStatus }
          : user
        )
      );
      toast.success(`${username} drafting status updated.`);
    } catch (error) {
      console.error(`Error updating drafting status for ${username}:`, error);
      toast.error(`Error updating drafting status for ${username}`);
    }
  };

  const updateUserDraftingStatus = (teamKey, draftingNow) => {
    fetch(`${API_URL}/update_user_drafting_status`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        team_key: teamKey,
        drafting_now: draftingNow
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        return;
      } else {
        setUserDraftingStatus(prevUsers => 
          prevUsers.map(user => 
            user.team_key === teamKey 
              ? { ...user, drafting_now: !draftingNow }
              : user
          )
        );
      }
    })
    .catch(error => {
      console.error(error);
    });
  };

  return (
    <form className="admin-form add-keeper-form">
      <div className="instructions center">
        <div>
          <Emoji emoji="✨" />&nbsp;
          Refresh draft, team, and player data and force an update for all users.
        </div>
      </div>
      <div className="center">
        <button
          className={`refresh-button ${isSpinning ? 'spinning' : ''}`}
          onClick={refreshData}
          disabled={isSpinning}
          >
          <div>
            <Emoji emoji="🔄" />
          </div>
        </button>
      </div>
      <div className="instructions center">
        <div>
          <Emoji emoji="✨" />&nbsp;
          Control which users are currently up in the draft.
        </div>
      </div>
      <div className="center">
        <button
          className="small-button get-drafting-status-button"
          onClick={getUserDraftingStatus}
        >
          <div><Emoji emoji="👀" />&nbsp;</div>
          Check drafting users
        </button>
      </div>
      {userDraftingStatus.length > 0 && (
        <div className="instructions center">
          <form className="users-drafting-form">
            {userDraftingStatus.map((user, index) => (
              <div className="user-drafting-status-wrapper" key={user.user_id}>
                {/* <label>{user.team_key}</label> */}
                <span>{user.username}</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={user.drafting_now}
                    onChange={(e) => handleDraftingStatusChange(user.team_key, user.username, e.target.checked)}
                  />
                  <div className="slider round" />
                </label>
              </div>
            ))}
          </form>
        </div>
      )}
    </form>
  );
}
