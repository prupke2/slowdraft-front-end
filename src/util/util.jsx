import React from 'react';

export const webToken = localStorage.getItem('web_token');

export const teamIdToKey = (teamId) => {
  const teams = JSON.parse(localStorage.getItem('teams'));
  const targetTeam = teams.find(team => (
    team.team_id === teamId.toString()
  ));
  return targetTeam ? targetTeam.team_key : null;
};

export const teamsMap = (teams) => {
  if (!teams || teams.length === 0) {
    return null;
  }
  return teams.map(
    team => {
      return (
        <option 
          key={team.team_id} 
          value={team.team_id}
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
  const url = window.location.href;
  return substringInString(url, "localhost:3000") || substringInString(url, "0.0.0.0:3000/");
}

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
