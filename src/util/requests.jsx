import { ToastsStore } from "react-toasts";
import { getHeaders, binaryToBoolean, API_URL } from "./util";

export function getDraft(setPicks, setCurrentPick, setDraftingNow) {
  fetch(`${API_URL}/get_draft`, {
    method: "GET",
    headers: getHeaders(),
  }).then(async (response) => {
    const data = await response.json();
    if (data.success === true) {
      localStorage.setItem("picks", JSON.stringify(data.picks));
      localStorage.setItem("draftData", JSON.stringify(data.draft));
      localStorage.setItem("draftDataUpdate", new Date());
      setPicks(data.picks);
      setDraftingNow(data.drafting_now);
      if (typeof data.current_pick !== "undefined") {
        setCurrentPick(data.current_pick);
      }
    } else {
      ToastsStore.error("Error getting draft.");
      const error = (data && data.message) || response.status;
      return Promise.reject(error);
    }
  });
}

export function getDBPlayers(setPlayers) {
  fetch(`${API_URL}/get_db_players`, {
    method: "GET",
    headers: getHeaders(),
  }).then(async (response) => {
    const data = await response.json();
    if (data.success === true) {
      localStorage.setItem("playerDBData", JSON.stringify(data.players));
      localStorage.setItem("playerDBUpdate", new Date());
      setPlayers(data.players);
    } else {
      ToastsStore.error("Error getting players.");
      const error = (data && data.message) || response.status;
      return Promise.reject(error);
    }

  });
}

export function getDBGoalies(setGoalies) {
  fetch(`${API_URL}/get_db_players?position=G`, {
    method: "GET",
    headers: getHeaders(),
  }).then(async (response) => {
    const data = await response.json();
    if (data.success === true) {
      localStorage.setItem("goalieDBData", JSON.stringify(data.players));
      localStorage.setItem("goalieDBUpdate", new Date());
      setGoalies(data.players);
    } else {
      ToastsStore.error("Error getting goalies.");
      const error = data?.message || response.status;
      console.log(`error: ${error}`);
      return Promise.reject(error);
    }
  });
}

export function getTeams(setTeams) {
  fetch(`${API_URL}/get_teams`, {
    method: "GET",
    headers: getHeaders(),
  }).then(async (response) => {
    const data = await response.json();
    if (data.success === true) {
      localStorage.setItem("playerTeamData", JSON.stringify(data.teams));
      localStorage.setItem("playerTeamDataUpdate", new Date());
      setTeams(data.teams);
    } else {
      ToastsStore.error("Error getting teams.");
      const error = (data && data.message) || response.status;
      return Promise.reject(error);
    }
  });
}

export function getRules(setRules) {
  fetch(`${API_URL}/get_all_rules`, {
    method: "GET",
    headers: getHeaders(),
  }).then(async (response) => {
    const data = await response.json();
    if (data.success === true) {
      localStorage.setItem("rulesData", JSON.stringify(data.rules));
      localStorage.setItem("rulesUpdate", new Date());
      setRules(data.rules);
    } else {
      ToastsStore.error("Error getting rules.");
      const error = (data && data.message) || response.status;
      return Promise.reject(error);
    }
  });
}

export function getForumPosts(setPosts) {
  fetch(`${API_URL}/get_forum_posts`, {
    method: "GET",
    headers: getHeaders(),
  }).then(async (response) => {
    const data = await response.json();
    if (data.success === true) {
      localStorage.setItem("forumData", JSON.stringify(data.posts));
      localStorage.setItem("forumUpdate", new Date());
      setPosts(data.posts);
    } else {
      ToastsStore.error("Error getting forum posts.");
      const error = (data && data.message) || response.status;
      return Promise.reject(error);
    }

  });
}

export function selectLeague(
  leagueKey,
  setPicks,
  setCurrentPick,
  setDraftingNow
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
        localStorage.setItem("liveDraft", binaryToBoolean(data.is_live_draft));
        localStorage.setItem("draftIsOver", binaryToBoolean(data.is_over));
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("pub", data.pub);
        localStorage.setItem("sub", data.sub);
        getDraft(setPicks, setCurrentPick, setDraftingNow);
      } else if (data.error === "INVALID_REFRESH_TOKEN") {
        localStorage.clear();
        ToastsStore.error(
          "Your Yahoo connection has expired."
        );
      } else {
        ToastsStore.error(
          "There was an error connecting to Yahoo. Please try again later."
        );
      }
    })
    .catch((error) => {
      ToastsStore.error(
        `There was an error connecting to Yahoo. Please try again later.`
      );
      console.log(`Error: ${error.text}`);
    });
}

export function checkForUpdates(
  setPicks,
  setCurrentPick,
  setDraftingNow,
  setPlayers,
  setGoalies,
  setTeams,
  setRules,
  setPosts
) {
  // const isRegisteredLeague = localStorage.getItem('registeredLeague') === 'true';

  // if (!isRegisteredLeague) {
  //   return
  // }

  fetch(`${API_URL}/check_for_updates`, {
    method: "GET",
    headers: getHeaders(),
  }).then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      const error = (data && data.message) || response.status;
      return Promise.reject(error);
    }
    if (data.updates) {
      setDraftingNow(data.drafting_now);

      // 5 seconds is added to the update timestamp to prevent it from not updating due to a race condition
      if (
        Date.parse(data.updates.latest_draft_update) + 5 >
        Date.parse(localStorage.getItem("draftDataUpdate"))
      ) {
        console.log("Update draft data...");
        getDraft(setPicks, setCurrentPick, setDraftingNow);
      }
      if (
        Date.parse(data.updates.latest_player_db_update) + 5 >
        Date.parse(localStorage.getItem("playerDBUpdate"))
      ) {
        console.log("Update player DB data...");
        getDBPlayers(setPlayers);
      }
      if (
        Date.parse(data.updates.latest_goalie_db_update) + 5 >
        Date.parse(localStorage.getItem("goalieDBUpdate"))
      ) {
        console.log("Update goalie DB data...");
        getDBGoalies(setGoalies);
      }
      if (
        Date.parse(data.updates.latest_team_update) + 5 >
        Date.parse(localStorage.getItem("playerTeamDataUpdate"))
      ) {
        console.log("Update team data...");
        getTeams(setTeams);
      }
      if (
        Date.parse(data.updates.latest_rules_update) + 5 >
        Date.parse(localStorage.getItem("rulesUpdate"))
      ) {
        console.log("Update rules data...");
        getRules(setRules);
      }
      if (
        Date.parse(data.updates.latest_forum_update) + 5 >
        Date.parse(localStorage.getItem("forumUpdate"))
      ) {
        console.log("Update forum data...");
        getForumPosts(setPosts);
      }
    } else {
      console.log(`No updates.`);
    }
  });
}
