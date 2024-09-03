import React from "react";
import qs from "query-string";

export const API_URL = localEnvironment() ? 'http://localhost:8000' : 'https://slowdraft-api.vercel.app';

export const WEBSOCKET_URL = localEnvironment() ? 'ws://localhost:8000/chat' : 'wss://slowdraft-api.vercel.app/chat';

export function updateUrlPath(path) {
  window.history.replaceState(null, null, path);
}

export const mobileCheck = () => {

  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    console.log(`mobile: ${navigator.userAgent}`);
    return true;
  } else {
    console.log(`NOT mobile: ${navigator.userAgent}`);
  }
  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    console.log(`deferredPrompt: ${deferredPrompt}`);

    // Update UI notify the user they can install the PWA
    // Optionally, send analytics event that PWA install promo was shown.
    console.log(`'beforeinstallprompt' event was fired.`);
  });
  return false;
}

export const getParam = (param) => {
  const currentParams = qs.parse(window.location.search.substring(1));
  return currentParams[param];
};

export const validateTeamParam = (teams) => {
  const teamId = parseInt(getParam("team"), 10);
  if (!teamId || Number.isNaN(teamId)) {
    return false;
  }
  let validTeamId = null;
  teams.every((team) => {
    if (team.yahoo_team_id === parseInt(teamId, 10)) {
      validTeamId = teamId;
      return false;
    }
    return true;
  });
  return validTeamId;
};

export const teamKeyToID = (teamKey) => {
  const teams = JSON.parse(localStorage.getItem("teams"));
  const targetTeam = teams.find(
    (team) => team.team_key === teamKey
  );
  return targetTeam ? targetTeam.yahoo_team_id : null;
}

export const teamIdToKey = (teamId) => {
  const teams = JSON.parse(localStorage.getItem("teams"));
  const targetTeam = teams.find(
    (team) => team.yahoo_team_id === parseInt(teamId, 10)
  );
  return targetTeam ? targetTeam.team_key : null;
};

export const teamIdToLogo = (teamId) => {
  const teams = JSON.parse(localStorage.getItem("teams"));
  return teams && teamId ? teams[teamId - 1].team_logo : null;
};

export const teamIdToTeamName = (teamId) => {
  const teams = JSON.parse(localStorage.getItem("teams"));
  return teamId ? teams[teamId - 1].team_name : null;
};

export const teamsMap = (teams, returnType = "yahoo_team_id") => {
  if (!teams || teams.length === 0) {
    return null;
  }
  return teams.map((team) => {
    return (
      <option key={team[returnType]} value={team[returnType]}>
        {team.team_name}
      </option>
    );
  });
};

export const getHeaders = () => ({
  "Accept": "application/json",
  "Content-Type": "application/json",
  "Host": API_URL,
  "Access-Control-Allow-Origin": localEnvironment() ? '*' : 'https://slowdraft.vercel.app',
  "Authorization": localStorage.getItem("web_token"),
});

export function substringInString(string, substring) {
  return string.indexOf(substring) !== -1;
}

export const firstLetterOfEachWord = str => {
  const matches = str.match(/\b(\w)/g);
  return matches ? matches.join('') : str;
}

export function localEnvironment() {
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "0.0.0.0"
  );
}

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const binaryToBoolean = (binary) => {
  return binary === 1 || binary === "1" || binary === "true";
};

export function removeDuplicatesUsers(arr) {
  // If users log in more than once, prevent them from appearing twice in the user list
  const uniqueUsers = [];
  try {
    arr.reduce(function (acc, curr) {    
      if (!acc.includes(curr.teamKey)) {
        acc.push(curr.teamKey);
        uniqueUsers.push(curr);
      }
      return acc;
    }, []);
    return uniqueUsers.filter(user => user !== undefined);
  } catch {
    return arr;
  }
}

export function delayFunc(func, delayInMs) {
  setTimeout(function () {
    func()
  }, delayInMs);
}
