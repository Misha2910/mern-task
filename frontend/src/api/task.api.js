import { request } from "./apiInstance.js";

export const taskApi = {
  list: (token, projectId) =>
    request(`/projects/${projectId}/tasks`, { token }),
  create: (token, projectId, values) =>
    request(`/projects/${projectId}/tasks`, {
      token,
      method: "POST",
      body: values,
    }),
  update: (token, id, values) =>
    request(`/tasks/${id}`, { token, method: "PATCH", body: values }),
  remove: (token, id) => request(`/tasks/${id}`, { token, method: "DELETE" }),
};
