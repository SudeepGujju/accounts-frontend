import { CurrentUser, CurrentUserToken } from "../models";

const USER_STORAGE_KEY = "CURRENT_USER";
const USER_TOKEN_STORAGE_KEY = "CURRENT_USER_TOKEN";

const setUser = (user: CurrentUser): void => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

const getUser = (): CurrentUser => {
  const user = localStorage.getItem(USER_STORAGE_KEY);
  return user ? JSON.parse(user) : null;
};

const removeUser = (): void => {
  localStorage.removeItem(USER_STORAGE_KEY);
};

const setUserToken = (tokens: CurrentUserToken) => {
  localStorage.setItem(USER_TOKEN_STORAGE_KEY, JSON.stringify(tokens));
}

const getUserToken = () => {
  const tokens = localStorage.getItem(USER_TOKEN_STORAGE_KEY);
  return tokens ? JSON.parse(tokens) : null;
}

const getRefreshToken = (): string | null => {
  return getUserToken()?.refreshToken;
};

const getAccessToken = (): string | null => {
  return getUserToken()?.accessToken;
};

const setAccessToken = (token: string) => {

  const userTokens = getUserToken();

  if (userTokens) {
    userTokens.accessToken = token;
  }

  setUserToken(userTokens);
};

const removeUserToken = (): void => {
  localStorage.removeItem(USER_TOKEN_STORAGE_KEY);
};

export {
  setUserToken,
  getUserToken,
  getRefreshToken,
  getAccessToken,
  setAccessToken,
  removeUserToken,
  getUser,
  setUser,
  removeUser
}