import axios from "axios";

const instance = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, ""),
});

// Module-level token — set once on login, cleared on logout
let authToken = null;
export function setAuthToken(token) { authToken = token; }
export function clearAuthToken() { authToken = null; }

// Interceptor automatically attaches the token to every request
instance.interceptors.request.use((config) => {
  if (authToken) config.headers.Authorization = `Bearer ${authToken}`;
  return config;
});

export async function request(path, { method = "GET", body } = {}) {
  try {
    const { data } = await instance.request({ url: path, method, data: body });
    return data;
  } catch (err) {
    const message =
      err.response?.data?.error?.message || "The request could not be completed.";
    throw new Error(message);
  }
}

