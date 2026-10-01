import { request } from "./apiInstance.js";

export const taskApi = {
  list: (projectId) => request(`/projects/${projectId}/tasks`),
  create: (projectId, values) =>
    request(`/projects/${projectId}/tasks`, { method: "POST", body: values }),
  update: (id, values) => request(`/tasks/${id}`, { method: "PATCH", body: values }),
  remove: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
};

