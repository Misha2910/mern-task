import { request } from "./apiInstance.js";

export const projectApi = {
  list: () => request("/projects"),
  create: (values) => request("/projects", { method: "POST", body: values }),
  update: (id, values) => request(`/projects/${id}`, { method: "PATCH", body: values }),
  remove: (id) => request(`/projects/${id}`, { method: "DELETE" }),
};

