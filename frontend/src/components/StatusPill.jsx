import { statusIcons } from "../constants.js";

export default function StatusPill({ status }) {
  const Icon = statusIcons[status];
  return (
    <span
      className={`status-pill status-${status.toLowerCase().replace(" ", "-")}`}
    >
      <Icon size={14} />
      {status}
    </span>
  );
}
