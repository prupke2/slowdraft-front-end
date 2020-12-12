

export function getLeague() {
  fetch('/get_league').then(res => res.json()).then(data => {
    console.log("test data: " + JSON.stringify(data, null, 4));
    return "Got 'em"
  });
}

export function players() {
  fetch('/get_players').then(res => res.json()).then(data => {
    console.log("test data: " + JSON.stringify(data, null, 4));
    return "Got 'em"
  });
}

export function yahooApi(endpoint) {
  fetch(`/${endpoint}`).then(res => res.json()).then(data => {
    console.log("data: " + JSON.stringify(data, null, 4));
    return {"response": 200, "data": data};
  });
}
