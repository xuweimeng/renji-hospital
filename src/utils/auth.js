import Cookies from 'js-cookie';

const TokenKey = 'Admin-Token';

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
  return Cookies.get(name);
}

export function setParameter(name, value) {
  return Cookies.set(name, value);
}

export function removeParameter(name) {
  return Cookies.remove(name);
}
