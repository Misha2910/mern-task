import { Check, ChevronDown, Trash2 } from "lucide-react";
import { statuses } from "../constants.js";
import Button from "./Button.jsx";
import StatusPill from "./StatusPill.jsx";

export default function TaskRow({ task, onEdit, onDelete, onUpdateStatus }) {
  return (
    <article className="task-row">
      <span
        className={`task-leading ${task.status === "Done" ? "is-done" : ""}`}
      >
        {task.status === "Done" ? <Check size={15} /> : <span />}
      </span>
      <button
        className="task-copy"
        type="button"
        onClick={() => onEdit(task)}
      >
        <strong>{task.title}</strong>
        <span>{task.description || "No description"}</span>
      </button>
      <div className="task-row-end">
        <StatusPill status={task.status} />
        <label className="status-select-wrap">
          <span className="sr-only">Update {task.title} status</span>
          <select
            value={task.status}
            onChange={(event) => onUpdateStatus(task, event.target.value)}
            aria-label={`Update ${task.title} status`}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <ChevronDown size={13} />
        </label>
        <Button
          variant="row-icon"
          icon={Trash2}
          title={`Delete ${task.title}`}
          aria-label={`Delete ${task.title}`}
          onClick={() => onDelete(task)}
        />
      </div>
    </article>
  );
}
