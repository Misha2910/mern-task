import { request } from "./apiInstance.js";

export const authApi = {
  login: (values) => request("/auth/login", { method: "POST", body: values }),
  register: (values) => request("/auth/register", { method: "POST", body: values }),
  currentUser: () => request("/auth/me"),
};

