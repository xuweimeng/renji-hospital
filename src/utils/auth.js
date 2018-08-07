import Cookies from 'js-cookie';

let TokenKey = 'Admin-Token';
const currentUrl = window.location.href;
let mark = '';
if (currentUrl.indexOf('tj') > -1) {
  mark = 'tj';
}
if (currentUrl.indexOf('lc') > -1) {
  mark = 'lc';
}
TokenKey += mark;
export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

/**
 * @function 设置，获取，清除相关的cookie
 * @param  {type} name {description}
 * @return {type} {description}
 */
export function getParameter(name) {
  return Cookies.get(name + mark);
}

export function setParameter(name, value) {
  return Cookies.set(name + mark, value);
}

export function removeParameter(name) {
  return Cookies.remove(name + mark);
}
