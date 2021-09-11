import { ToastsStore } from "react-toasts";

export function getDraft(user, setPicks, setCurrentPick, setDraftingNow) {

  fetch(`/get_draft/${user.draft_id}/${user.user_id}`)
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

export function getDBPlayers(user, setPlayers) {
  fetch(`/get_db_players/${user.draft_id}`)
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

export function getDBGoalies(user, setGoalies) {
  fetch(`/get_db_players/${user.draft_id}?position=G`)
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

export function getTeams(user, setTeams) {
  fetch(`/get_teams/${user.draft_id}`)
    .then(async response => {
      const data = await response.json();
      if (!response.ok) {
        ToastsStore.error("Error getting teams.")
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
      }
      localStorage.setItem('teamData', JSON.stringify(data))
      localStorage.setItem('teamDataUpdate', new Date())
      setTeams(data.teams);
  })
}

export function getRules(user, setRules) {
  fetch(`/get_all_rules/${user.league_id}`)
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

export function getForumPosts(user, setPosts) {
  fetch(`/get_forum_posts/${user.league_id}`)
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

export function checkForUpdates(draftOnly, user, setPicks, setCurrentPick, setDraftingNow, setPlayers, setGoalies, 
  setTeams, setRules, setPosts, getDraft, getDBPlayers, getDBGoalies, getTeams, getRules, getForumPosts) {
  const userData = user || JSON.parse(localStorage.getItem('user'));

  console.log(`userData: ${JSON.stringify(userData, null, 4)}`);
  
  fetch(`/check_for_updates/${userData.user_id}/${userData.league_id}`)
    .then(async response => {
      const data = await response.json();
      if (!response.ok) {
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
      }
      console.log(`data: ${JSON.stringify(data, null, 4)}`);
      if (data.updates) {
        setDraftingNow(data.drafting_now);
        
        if (Date.parse(data.updates.latest_draft_update) > Date.parse(localStorage.getItem('draftDataUpdate'))) {
          console.log("Update draft data...");
          getDraft(user, setPicks, setCurrentPick, setDraftingNow)
        }
        
        if (draftOnly === false) {
          if (Date.parse(data.updates.latest_player_db_update) > Date.parse(localStorage.getItem('playerDBUpdate'))) {
            console.log("Update player DB data...");
            getDBPlayers(user, setPlayers);
          } 
          if (Date.parse(data.updates.latest_goalie_db_update) > Date.parse(localStorage.getItem('goalieDBUpdate'))) {
            console.log("Update goalie DB data...");
            getDBGoalies(user, setGoalies);
          }
          if (Date.parse(data.updates.latest_team_update) > Date.parse(localStorage.getItem('teamDataUpdate'))) {
            console.log("Update team data...");
            getTeams(user, setTeams)
          }
          if (Date.parse(data.updates.latest_rules_update) > Date.parse(localStorage.getItem('rulesUpdate'))) {
            console.log("Update rules data...");
            getRules(user, setRules)
          }
          if (Date.parse(data.updates.latest_forum_update) > Date.parse(localStorage.getItem('forumUpdate'))) {
            console.log("Update forum data...");
            getForumPosts(user, setPosts);
          }
        }
      } else {
          console.log(`Data is empty, not fetching. user_id: ${userData.user_id}, league_id: ${userData.league_id}`);
      }
    }
  )
}
