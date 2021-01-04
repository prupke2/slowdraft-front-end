import { ToastsStore } from "react-toasts";

export function getTeamSession() {
  
  fetch('/get_team_session')
  .then(async response => {
    const data = await response.json();
    if (!response.ok) {
      const error = (data && data.message) || response.status;
      return Promise.reject(error);
    }
    if (data.error) {
      ToastsStore('There was an error connecting to Yahoo.')
    }
    if (data) {      
      localStorage.setItem('teamSessionData', JSON.stringify(data))
    } 
    return
  });
}
