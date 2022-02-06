import React from 'react';

export const webToken = localStorage.getItem('web_token');

export const teamIdToKey = (teamId) => {
  const teams = JSON.parse(localStorage.getItem('teams'));
  const targetTeam = teams.find(team => (
    team.team_id === teamId.toString()
  ));
  return targetTeam ? targetTeam.team_key : null;
};

export const teamIdToLogo = (teamId) => {
  const teams = JSON.parse(localStorage.getItem('teams'));
  return teams[teamId - 1].team_logo;
};

export const teamsMap = (teams, returnType='team_id') => {
  if (!teams || teams.length === 0) {
    return null;
  }
  return teams.map(
    team => {
      return (
        <option 
          key={team[returnType]} 
          value={team[returnType]}
        >
          {team.team_name}
        </option>
      )
    }
  )
}

export const getHeaders = () => (
  {
    'Accept': 'application/json', 
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('web_token')
  }
);

export function substringInString(string, substring) {
  return string.indexOf(substring) !== -1
}

export function localEnvironment() {
  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
}

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
