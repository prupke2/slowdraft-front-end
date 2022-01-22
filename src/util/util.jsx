export function substringInString(string, substring) {
  return string.indexOf(substring) !== -1
}

export function localEnvironment() {
  const url = window.location.href;
  return substringInString(url, "localhost:3000") || substringInString(url, "0.0.0.0:3000/");
}
