import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Request interceptor to get CSRF token
api.interceptors.request.use(async (config) => {
  // Get CSRF cookie before making requests
  if (["post", "put", "patch", "delete"].includes(config.method)) {
    await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
      withCredentials: true,
    });
  }
  return config;
});

export default api;
