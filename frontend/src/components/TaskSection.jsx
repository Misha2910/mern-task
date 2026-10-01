import { CircleDot, Plus, Search } from "lucide-react";
import { statuses } from "../constants.js";
import Button from "./Button.jsx";
import TaskRow from "./TaskRow.jsx";

export default function TaskSection({
  tasks,
  visibleTasks,
  tasksLoading,
  filter,
  search,
  counts,
  onFilterChange,
  onSearchChange,
  onEditTask,
  onDeleteTask,
  onUpdateTaskStatus,
  onNewTask,
}) {
  return (
    <section className="task-section">
      <div className="task-section-heading">
        <div>
          <p className="eyebrow">THE DETAILS</p>
          <h2>
            Tasks <span>{tasks.length}</span>
          </h2>
        </div>
        <div className="task-tools">
          <label className="search-field">
            <Search size={16} />
            <input
              aria-label="Search tasks"
              placeholder="Find a task"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </label>
        </div>
      </div>
      <div className="task-tabs" role="tablist" aria-label="Filter tasks">
        {["All tasks", ...statuses].map((status) => (
          <button
            className={filter === status ? "selected" : ""}
            key={status}
            type="button"
            role="tab"
            aria-selected={filter === status}
            onClick={() => onFilterChange(status)}
          >
            {status}
            <span>{counts[status] || 0}</span>
          </button>
        ))}
      </div>
      <div className="task-list">
        {tasksLoading ? (
          <div className="loading-state compact">
            <span className="spinner" />
            Loading tasks…
          </div>
        ) : visibleTasks.length ? (
          visibleTasks.map((task) => (
            <TaskRow
              key={task._id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onUpdateStatus={onUpdateTaskStatus}
            />
          ))
        ) : (
          <div className="empty-tasks">
            <div className="empty-icon">
              <CircleDot size={21} />
            </div>
            <h3>
              {search
                ? "No matching tasks"
                : filter === "All tasks"
                  ? "A fresh page."
                  : `Nothing ${filter.toLowerCase()} yet.`}
            </h3>
            <p>
              {search
                ? "Try a different search term."
                : "Add a task to give this project its next step."}
            </p>
            {filter === "All tasks" && !search && (
              <Button icon={Plus} onClick={onNewTask}>
                Add the first task
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
