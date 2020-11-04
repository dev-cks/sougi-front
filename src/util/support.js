import Cookies from "js-cookie";
const SupportKey='supportKey';
export function getSupport() {
  return Cookies.get(SupportKey)
}

export function setSupport(isSupport) {
  return Cookies.set(SupportKey, isSupport,{ expires: 3 })
}

export function setCookie(key,value,expires) {

  if(expires == undefined) {
    return Cookies.set(key, value, {expires: 365});
  }
  return Cookies.set(key, value,{ expires: expires})
}

export function getCookie(key) {
  return Cookies.get(key)
}

export function removeCookie(key) {
  return Cookies.remove(key);
}
