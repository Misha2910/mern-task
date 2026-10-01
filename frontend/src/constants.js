import { Circle, CircleCheck, CircleDot } from "lucide-react";

export const statuses = ["Todo", "In Progress", "Done"];

export const statusIcons = {
  Todo: Circle,
  "In Progress": CircleDot,
  Done: CircleCheck,
};

export function getStoredSession() {
  try {
    return JSON.parse(localStorage.getItem("folio-session") || "null");
  } catch {
    return null;
  }
}
