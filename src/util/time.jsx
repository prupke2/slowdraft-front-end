export function adjustOffset(ts) {
  const timeStamp = new Date(ts);
  const offsetAdjustment = timeStamp.getTimezoneOffset() * 60 * 1000;
  return new Date(timeStamp.getTime() - offsetAdjustment);
}

export function timeSince(ts) {
  const timeStamp = adjustOffset(ts);
  const now = new Date(),
    secondsPast = (now.getTime() - timeStamp) / 1000;

  if (secondsPast < 60) {
    if (secondsPast < 10) return 'just now';
    return parseInt(secondsPast) + 's ago';
  }
  if (secondsPast < 3600) {
    return parseInt(secondsPast / 60) + 'm ago';
  }
  if (secondsPast <= 86400) {
    return parseInt(secondsPast / 3600) + 'h ago' ;
  }
  if (secondsPast <= 2629800) {
    const days = parseInt(secondsPast / 86400);
    return days === 1 ? '1 day ago' : `${days} days ago` ;
  }
  if (secondsPast > 2629800) {
    const day = timeStamp.getDate();
    const month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
    const year = timeStamp.getFullYear() === now.getFullYear() ? "" : ", " + timeStamp.getFullYear();
    return month + " " + day + year;
  }
}
