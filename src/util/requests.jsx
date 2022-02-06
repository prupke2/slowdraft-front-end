import { ToastsStore } from "react-toasts";
import { getHeaders } from "./util";

export function getDraft(setPicks, setCurrentPick, setDraftingNow) {
  fetch(`/get_draft`, {
    method: 'GET',
    headers: getHeaders()
  })
    .then(async response => {
      const data = await response.json();
      if (!response.ok) {
        ToastsStore.error("Error getting draft.")
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
      }
      localStorage.setItem('draftData', JSON.stringify(data))
      localStorage.setItem('draftDataUpdate', new Date())

      setPicks(data.picks);
      setDraftingNow(data.drafting_now);
      if (typeof(data.current_pick) !== 'undefined') {
        setCurrentPick(data.current_pick);
      }
    }
  )
}

export function getDBPlayers(setPlayers) {
  fetch(`/get_db_players`, {
    method: 'GET',
    headers: getHeaders()
  })
    .then(async response => {
      const data = await response.json();
      if (!response.ok) {
          ToastsStore.error("Error getting players.")
          const error = (data && data.message) || response.status;
        return Promise.reject(error);
      }
      localStorage.setItem('playerDBData', JSON.stringify(data))
      localStorage.setItem('playerDBUpdate', new Date())
      setPlayers(data.players);
    }
  )
}

export function getDBGoalies(setGoalies) {
  fetch(`/get_db_players?position=G`, {
    method: 'GET',
    headers: getHeaders()
  })
    .then(async response => {
      const data = await response.json();
      if (!response.ok) {
        ToastsStore.error("Error getting goalies.")
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
      }
      localStorage.setItem('goalieDBData', JSON.stringify(data))
      localStorage.setItem('goalieDBUpdate', new Date())
      setGoalies(data.players);
    }
  )
}

export function getTeams(setTeams) {
  fetch(`/get_teams`, {
    method: 'GET',
    headers: getHeaders()
  })
    .then(async response => {
      const data = await response.json();
      if (!response.ok) {
        ToastsStore.error("Error getting teams.")
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
      }
      localStorage.setItem('playerTeamData', JSON.stringify(data))
      localStorage.setItem('playerTeamDataUpdate', new Date())
      setTeams(data.teams);
  })
}

export function getRules(setRules) {
  fetch(`/get_all_rules`, {
    method: 'GET',
    headers: getHeaders()
  })
    .then(async response => {
      const data = await response.json();
      if (!response.ok) {
        ToastsStore.error("Error getting rules.")
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
      }
      localStorage.setItem('rulesData', JSON.stringify(data))
      localStorage.setItem('rulesUpdate', new Date())
      setRules(data.rules);
    }
  )
}

export function getForumPosts(setPosts) {
  fetch(`/get_forum_posts`, {
    method: 'GET',
    headers: getHeaders()
  })
    .then(async response => {
      const data = await response.json();
      if (!response.ok) {
        ToastsStore.error("Error getting forum posts.")
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
      }
      localStorage.setItem('forumData', JSON.stringify(data))
      localStorage.setItem('forumUpdate', new Date())
      setPosts(data.posts);
    }
  )
}

export function checkForUpdates(draftOnly, setPicks, setCurrentPick, setDraftingNow, 
  setPlayers, setGoalies, setTeams, setRules, setPosts) {

  fetch(`/check_for_updates`, {
    method: 'GET',
    headers: getHeaders()
  })
    .then(async response => {
      const data = await response.json();
      if (!response.ok) {
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
      }
      if (data.updates) {
        setDraftingNow(data.drafting_now);
        
        // 5 seconds is added to the update timestamp to prevent it from not updating due to a race condition
        if ((Date.parse(data.updates.latest_draft_update) + 5) > Date.parse(localStorage.getItem('draftDataUpdate'))) {
          console.log("Update draft data...");
          getDraft(setPicks, setCurrentPick, setDraftingNow)
        }
        
        if (draftOnly === false) {

          if ((Date.parse(data.updates.latest_player_db_update) + 5) > Date.parse(localStorage.getItem('playerDBUpdate'))) {
            console.log("Update player DB data...");
            getDBPlayers(setPlayers);
          } 
          if ((Date.parse(data.updates.latest_goalie_db_update) + 5) > Date.parse(localStorage.getItem('goalieDBUpdate'))) {
            console.log("Update goalie DB data...");
            getDBGoalies(setGoalies);
          }
          if ((Date.parse(data.updates.latest_team_update) + 5) > Date.parse(localStorage.getItem('playerTeamDataUpdate'))) {
            console.log("Update team data...");
            getTeams(setTeams)
          }
          if ((Date.parse(data.updates.latest_rules_update) + 5) > Date.parse(localStorage.getItem('rulesUpdate'))) {
            console.log("Update rules data...");
            getRules(setRules)
          }
          if ((Date.parse(data.updates.latest_forum_update) + 5) > Date.parse(localStorage.getItem('forumUpdate'))) {
            console.log("Update forum data...");
            getForumPosts(setPosts);
          }
        }
      } else {
        console.log(`No updates.`);
      }
    }
  )
}
