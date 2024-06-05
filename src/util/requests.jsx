import { toast } from "react-toastify";
import { getHeaders, binaryToBoolean, API_URL } from "./util";

export const getOptions = {
  method: "GET",
  headers: getHeaders(),
}

export const offsetMilliseconds = new Date().getTimezoneOffset() * 60000;

export const healthCheck = (setHealthStatus) => {
  try {
    fetch(`${API_URL}/health`, {
      method: "GET"
    }).then(async (response) => {
      if (!response.ok) {
        return false;
      }
      const data = await response.json();
      console.log(`data: ${data}`);
      if (data === 200) {
        setHealthStatus('up');
      } else {
        setHealthStatus('down');
      }
    }).then(
      setTimeout(healthCheck(setHealthStatus), 5000)
    ).catch((error) => {
      console.log(`Error reaching health endpoint: ${error}`);
      setHealthStatus('down');
    });
  } catch {
    console.log("Error reaching health endpoint.");
    setHealthStatus('down');
  }
}

export const getChatToken = () => {
  fetch(`${API_URL}/get_chat_token`, {
    method: "GET",
    headers: getHeaders(),
  }).then(async (response) => {
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    console.log('data: ', data);
    
    localStorage.setItem("chatToken", JSON.stringify(data.token));
  }).catch((error) => {
    console.log(`Error getting chat token: ${error}`);
  });
}

export function getDraft(setCurrentPick, setDraftingNow) {
  fetch(`${API_URL}/get_draft`, {
    method: "GET",
    headers: getHeaders(),
  }).then(async (response) => {
    const data = await response.json();
    if (data.success === true) {
      localStorage.setItem("picks", JSON.stringify(data.picks));
      localStorage.setItem("draftData", JSON.stringify(data.draft));
      localStorage.setItem("draftDataUpdate", new Date());
      localStorage.setItem("currentPick", JSON.stringify(data.current_pick));
      localStorage.setItem("liveDraft", binaryToBoolean(data.draft.is_live));
      localStorage.setItem("draftIsOver", binaryToBoolean(data.draft.is_over));
      setCurrentPick(data.current_pick);
      setDraftingNow(data.drafting_now);
    } else {
      toast("Error getting draft.");
      const error = (data && data.message) || response.status;
      return Promise.reject(error);
    }
  });
}

export function getDBPlayers() {
  fetch(`${API_URL}/get_db_players_new`, {
    method: "GET",
    headers: getHeaders(),
  }).then(async (response) => {
    const data = await response.json();
    if (data.success === true) {
      localStorage.setItem("playerDBData", JSON.stringify(data.players));
      localStorage.setItem("playerDBUpdate", new Date());
    } else {
      toast("Error getting players.");
      const error = (data && data.message) || response.status;
      return Promise.reject(error);
    }

  });
}

export function getDBGoalies() {
  fetch(`${API_URL}/get_db_players_new?position=G`, {
    method: "GET",
    headers: getHeaders(),
  }).then(async (response) => {
    const data = await response.json();
    if (data.success === true) {
      localStorage.setItem("goalieDBData", JSON.stringify(data.players));
      localStorage.setItem("goalieDBUpdate", new Date());
    } else {
      toast("Error getting goalies.");
      const error = data?.message || response.status;
      console.log(`error: ${error}`);
      return Promise.reject(error);
    }
  });
}

export function getTeams() {
  fetch(`${API_URL}/get_teams`, {
    method: "GET",
    headers: getHeaders(),
  }).then(async (response) => {
    const data = await response.json();
    if (data.success === true) {
      localStorage.setItem("playerTeamData", JSON.stringify(data.teams));
      localStorage.setItem("playerTeamDataUpdate", new Date());
    } else {
      toast("Error getting teams.");
      const error = (data && data.message) || response.status;
      return Promise.reject(error);
    }
  });
}

export function getWatchlistIds() {
  fetch(`${API_URL}/get_watchlist`, {
    method: "GET",
    headers: getHeaders(),
  }).then(async (response) => {
    const data = await response.json();
    if (data.success === true) {
      localStorage.setItem("watchlist", JSON.stringify(data.players));
    } else {
      const error = (data && data.message) || response.status;
      return Promise.reject(error);
    }
  });
}

export function getRules() {
  fetch(`${API_URL}/get_all_rules`, {
    method: "GET",
    headers: getHeaders(),
  }).then(async (response) => {
    const data = await response.json();
    if (data.success === true) {
      localStorage.setItem("rulesData", JSON.stringify(data.rules));
      localStorage.setItem("rulesUpdate", new Date());
      return data;
    } else {
      toast("Error getting rules.");
      const error = (data && data.message) || response.status;
      return Promise.reject(error);
    }
  });
}

export function getForumPosts() {
  fetch(`${API_URL}/get_forum_posts`, {
    method: "GET",
    headers: getHeaders(),
  }).then(async (response) => {
    const data = await response.json();
    if (data.success === true) {
      localStorage.setItem("forumData", JSON.stringify(data.posts));
      localStorage.setItem("forumUpdate", new Date());
    } else {
      toast("Error getting forum posts.");
      const error = (data && data.message) || response.status;
      return Promise.reject(error);
    }

  });
}

export function selectLeague(
  leagueKey,
  setCurrentPick,
  setDraftingNow,
  registeredLeague
) {
  const requestParams = {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      league_key: leagueKey,
    }),
  };
  fetch(`${API_URL}/select_league`, requestParams)
    .then((response) => {
      if (!response.ok) throw response;
      return response.json();
    })
    .then((data) => {
      if (data.success === true) {
        const user = data.user;
        localStorage.setItem("teams", JSON.stringify(data.teams));
        localStorage.setItem("web_token", data.web_token);
        localStorage.setItem("registeredLeague", data.registered);
        localStorage.setItem("liveDraft", binaryToBoolean(data.is_live));
        localStorage.setItem("draftIsOver", binaryToBoolean(data.is_over));
        localStorage.setItem("user", JSON.stringify(user));
        if (registeredLeague) {
          getDraft(setCurrentPick, setDraftingNow);
        }
      } else if (data.error === "INVALID_REFRESH_TOKEN") {
        localStorage.clear();
        toast(
          "Your Yahoo connection has expired."
        );
      } else {
        toast(
          "There was an error connecting to Yahoo. Please try again later."
        );
      }
    })
    .catch((error) => {
      toast(
        `There was an error connecting to Yahoo. Please try again later.`
      );
      console.log(`Error: ${error.text}`);
    });
}

export function checkForUpdates(
  setCurrentPick,
  setDraftingNow,
  logout,
) {
  // const isRegisteredLeague = localStorage.getItem('registeredLeague') === 'true';

  // if (!isRegisteredLeague) {
  //   return
  // }

  function updateNeeded(localStorageUpdateItem, latestUpdate) {
    const localStorageUpdateString = localStorage.getItem(localStorageUpdateItem);
    if (!localStorageUpdateString) {
      return true;
    }
    const lastUpdateLocalStorage = new Date(localStorageUpdateString);
    const latestUpdateWithOffset = new Date(latestUpdate) - offsetMilliseconds;
    return latestUpdateWithOffset > lastUpdateLocalStorage;
  }

  fetch(`${API_URL}/check_for_updates`, {
    method: "GET",
    headers: getHeaders(),
  }).then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      const error = (data && data.message) || response.status;
      return Promise.reject(error);
    }
    if (data.success === false && data?.error === 'expired_token') {
      toast('Your login has expired. Please log in again.')
      logout();
      return;
    }
    if (data?.updates) {
      setDraftingNow(data.drafting_now);

      if (updateNeeded("draftDataUpdate", data.updates.latest_draft_update)) {
        console.log("Update draft data...");
        getDraft(setCurrentPick, setDraftingNow);
      }
      if (updateNeeded("playerDBUpdate", data.updates.latest_player_db_update)) {
        console.log("Update player DB data...");
        getDBPlayers();
      }
      if (updateNeeded("goalieDBUpdate", data.updates.latest_goalie_db_update)) {
        console.log("Update goalie DB data...");
        getDBGoalies();
      }
      if (updateNeeded("playerTeamDataUpdate", data.updates.latest_team_update)) {
        console.log("Update team data...");
        getTeams();
      }
      if (updateNeeded("rulesUpdate", data.updates.latest_rules_update)) {
        console.log("Update rules data...");
        getRules();
      }
      if (updateNeeded("forumUpdate", data.updates.latest_forum_update)) {
        console.log("Update forum data...");
        getForumPosts();
      }
    } else {
      console.log('data:', data);

      if (data?.error) {
        if (data?.status === 401 || data?.status === 403)
        console.log("Logging out");
        return Promise.reject("Your login has expired.");
      }
      console.log(`No updates.`);
    }
  });
}

export function addToWatchlist(playerId) {
  fetch(`${API_URL}/add_to_watchlist`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      player_id: playerId,
    }),
  }).then(async (response) => {
    const data = await response.json();
    if (data.success === true) {
      const currentWatchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
      const newWatchlist = [...currentWatchlist, playerId];
      localStorage.setItem("watchlist", JSON.stringify(newWatchlist));
      return true;
    } else {
      toast("Error updating watchlist - please try again later.");
      const error = (data && data.message) || response.status;
      return Promise.reject(error);
    }
  });
}

export function removeFromWatchlist(playerId) {
  fetch(`${API_URL}/remove_from_watchlist`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      player_id: playerId
    }),
  }).then(async (response) => {
    const data = await response.json();
    if (data.success === true) {
      const currentWatchlist = JSON.parse(localStorage.getItem("watchlist"));
      console.log('currentWatchlist:', currentWatchlist);

      if (!currentWatchlist) {
        return true;
      }
      const newWatchlist = currentWatchlist.filter(p => p !== playerId);
      console.log('newWatchlist:', newWatchlist);

      localStorage.setItem("watchlist", JSON.stringify(newWatchlist));
    } else {
      toast("Error updating watchlist - please try again later.");
      const error = (data && data.message) || response.status;
      return Promise.reject(error);
    }
  });
}
