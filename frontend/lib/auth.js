import { TOKEN_KEY } from './api';

const USER_KEY = 'football_os_user';

function isBrowser() {
  return typeof window !== 'undefined';
}

function getToken() {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  if (!isBrowser()) return;
  if (!token) {
    window.localStorage.removeItem(TOKEN_KEY);
    return;
  }
  window.localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(TOKEN_KEY);
}

function getUser() {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setUser(user) {
  if (!isBrowser()) return;
  if (!user) {
    window.localStorage.removeItem(USER_KEY);
    return;
  }
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearUser() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(USER_KEY);
}

function clearSession() {
  clearToken();
  clearUser();
}

export {
  getToken,
  setToken,
  clearToken,
  getUser,
  setUser,
  clearUser,
  clearSession,
};