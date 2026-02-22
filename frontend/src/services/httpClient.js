import axios from "axios";
import { authApi } from "./authApi.js";

const httpClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

httpClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let subscribers = [];

function onRefreshed(token) {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
}

function addSubscriber(callback) {
  subscribers.push(callback);
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If refresh endpoint fails, redirect to login
    if (
      error.response?.status === 401 &&
      originalRequest.url?.includes("/auth/refresh")
    ) {
      // Clear auth state and redirect to login
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    // Try to refresh token for other 401 errors
    // BUT NOT for login/register endpoints (those 401s are normal - wrong password, etc.)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/register")
    ) {
      originalRequest._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { accessToken: newToken } = await authApi.refresh();
          setAccessToken(newToken);
          onRefreshed(newToken);
        } catch (err) {
          // Refresh failed - clear auth and redirect to login
          isRefreshing = false;
          localStorage.removeItem("user");
          if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
            window.location.href = "/login";
          }
          return Promise.reject(err);
        }
        isRefreshing = false;
      }

      return new Promise((resolve) => {
        addSubscriber((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(httpClient(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  },
);

export { httpClient };


