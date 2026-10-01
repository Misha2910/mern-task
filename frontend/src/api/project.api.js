import { request } from "./apiInstance.js";

export const projectApi = {
  list: (token) => request("/projects", { token }),
  create: (token, values) =>
    request("/projects", { token, method: "POST", body: values }),
  update: (token, id, values) =>
    request(`/projects/${id}`, { token, method: "PATCH", body: values }),
  remove: (token, id) =>
    request(`/projects/${id}`, { token, method: "DELETE" }),
};
