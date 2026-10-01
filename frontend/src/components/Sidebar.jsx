import { ArrowRight, FolderKanban, LogOut, Plus } from "lucide-react";
import Button from "./Button.jsx";

export default function Sidebar({
  session,
  projects,
  selectedProjectId,
  projectsLoading,
  onSelectProject,
  onCreateProject,
  onSignOut,
}) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#workspace" aria-label="Folio home">
        <span className="brand-mark">
          <FolderKanban size={18} />
        </span>
        <span>
          Folio<span className="brand-period">.</span>
        </span>
      </a>
      <div className="sidebar-section-heading">
        <span>WORKSPACE</span>
        <span className="workspace-dot" />
      </div>
      <div className="project-nav-heading">
        <span>Projects</span>
        <Button
          variant="sidebar-icon"
          icon={Plus}
          title="Create project"
          aria-label="Create project"
          onClick={onCreateProject}
        />
      </div>
      <nav className="project-nav" aria-label="Projects">
        {projects.map((project, index) => (
          <button
            className={`project-nav-item ${selectedProjectId === project._id ? "active" : ""}`}
            key={project._id}
            type="button"
            onClick={() => onSelectProject(project._id)}
          >
            <span className={`project-swatch swatch-${index % 4}`} />
            <span className="project-nav-name">{project.name}</span>
            {selectedProjectId === project._id && <ArrowRight size={15} />}
          </button>
        ))}
        {!projects.length && !projectsLoading && (
          <p className="sidebar-empty">Your next project starts here.</p>
        )}
      </nav>
      <div className="sidebar-bottom">
        <div className="profile-avatar">
          {session.user.name.slice(0, 1).toUpperCase()}
        </div>
        <div className="profile-details">
          <strong>{session.user.name}</strong>
          <span>{session.user.email}</span>
        </div>
        <Button
          variant="sidebar-icon"
          icon={LogOut}
          title="Sign out"
          aria-label="Sign out"
          onClick={onSignOut}
        />
      </div>
    </aside>
  );
}
