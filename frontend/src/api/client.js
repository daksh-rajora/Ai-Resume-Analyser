import axios from "axios";

const LIVE_RENDER_API = "https://ai-resume-analyser-9wae.onrender.com/api";

function resolveBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl.endsWith("/api") ? envUrl : `${envUrl.replace(/\/+$/, "")}/api`;
  }
  return import.meta.env.DEV ? "/api" : LIVE_RENDER_API;
}

export const apiClient = axios.create({
  baseURL: resolveBaseUrl(),
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("arr_token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error?.message ||
      err.message ||
      "Request failed";
    return Promise.reject({
      status: err.response?.status,
      message,
      details: err.response?.data?.error?.details,
      original: err,
    });
  }
);
