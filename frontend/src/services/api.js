import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

/* Attach the JWT once real authentication is wired in (future phase). */
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("lumina.auth");
    if (raw) {
      const { token } = JSON.parse(raw);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    /* ignore malformed storage */
  }
  return config;
});

/** true when a real backend base URL has been provided via .env */
export const isBackendConfigured = Boolean(process.env.REACT_APP_API_URL);

export default api;
