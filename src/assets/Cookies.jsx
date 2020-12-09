
export const setCookie = (string, value) => {
  const expiry = new Date(); 
  expiry.setDate(expiry.getDate() + 90)
  document.cookie = string + "=" + value + "; expires=" + expiry + "; SameSite=Lax;"
}

export const getCookie = (cookieName) => {
  let name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export const deleteCookie = (cookieName) => {
  document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
