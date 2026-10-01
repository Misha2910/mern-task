import { FolderKanban, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import Button from "./Button.jsx";

export default function ProjectHeader({
  project,
  tasks,
  counts,
  openMenu,
  onToggleMenu,
  onEditProject,
  onDeleteProject,
  onNewTask,
}) {
  return (
    <>
      <section className="project-heading">
        <div>
          <p className="eyebrow">PROJECT OVERVIEW</p>
          <h1>{project.name}</h1>
          <p className="project-description">
            {project.description || "A good plan leaves room for good work."}
          </p>
        </div>
        <div className="heading-actions">
          <div className="project-menu-wrap">
            <Button
              variant="outline"
              icon={MoreHorizontal}
              aria-label="Project actions"
              title="Project actions"
              onClick={onToggleMenu}
            />
            {openMenu && (
              <div className="action-menu">
                <button type="button" onClick={onEditProject}>
                  Edit project
                </button>
                <button
                  className="menu-danger"
                  type="button"
                  onClick={onDeleteProject}
                >
                  <Trash2 size={14} />
                  Delete project
                </button>
              </div>
            )}
          </div>
          <Button icon={Plus} onClick={onNewTask}>
            New task
          </Button>
        </div>
      </section>
      <section className="summary-strip" aria-label="Task summary">
        <div className="summary-total">
          <span className="summary-mark">
            <FolderKanban size={17} />
          </span>
          <span>
            <strong>{tasks.length}</strong>
            <small>TOTAL TASKS</small>
          </span>
        </div>
        <div className="summary-stat">
          <span className="summary-dot todo-dot" />
          <strong>{counts.Todo || 0}</strong>
          <span>to do</span>
        </div>
        <div className="summary-stat">
          <span className="summary-dot progress-dot" />
          <strong>{counts["In Progress"] || 0}</strong>
          <span>in progress</span>
        </div>
        <div className="summary-stat">
          <span className="summary-dot done-dot" />
          <strong>{counts.Done || 0}</strong>
          <span>done</span>
        </div>
        <div className="summary-completion">
          <div className="completion-label">
            <span>Progress</span>
            <strong>
              {tasks.length
                ? Math.round((counts.Done / tasks.length) * 100)
                : 0}
              %
            </strong>
          </div>
          <div className="completion-track">
            <span
              style={{
                width: `${tasks.length ? (counts.Done / tasks.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
