
export const user = JSON.parse(localStorage.getItem('user'));
export const teams = JSON.parse(localStorage.getItem('teams'));
export const webToken = localStorage.getItem('web_token');

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
