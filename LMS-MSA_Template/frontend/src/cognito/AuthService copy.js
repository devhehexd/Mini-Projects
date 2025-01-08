import { authConfig } from "./authConfig";

export const login = () => {
  window.location.href = `https://lms-dev.auth.ap-southeast-1.amazoncognito.com/login?client_id=iok66cch21ar92r7ni1v2sqvo&response_type=token&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback`;
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  window.location.href = "/";
};

export const setAccessToken = (token) => {
  localStorage.setItem("accessToken", token);
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};
