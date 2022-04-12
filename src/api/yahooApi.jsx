export function yahooApi(endpoint) {
  fetch(`/${endpoint}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("data: " + JSON.stringify(data, null, 4));
      return { response: 200, data: data };
    });
}
