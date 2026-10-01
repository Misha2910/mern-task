import { startTransition, useEffect, useMemo, useState } from "react";
import { FolderKanban, Plus } from "lucide-react";
import { authApi } from "./api/auth.api.js";
import { projectApi } from "./api/project.api.js";
import { taskApi } from "./api/task.api.js";
import { statuses, getStoredSession } from "./constants.js";
import AuthScreen from "./AuthScreen.jsx";
import Button from "./components/Button.jsx";
import FormDialog from "./components/FormDialog.jsx";
import ProjectHeader from "./components/ProjectHeader.jsx";
import Sidebar from "./components/Sidebar.jsx";
import TaskSection from "./components/TaskSection.jsx";
import "./App.css";

export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(() =>
    Boolean(getStoredSession()?.token),
  );
  const [projects, setProjects] = useState([]);
  const [loadedProjectsFor, setLoadedProjectsFor] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const projectsLoading = Boolean(
    session && loadedProjectsFor !== session.token,
  );
  const [tasksLoading, setTasksLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");
  const [filter, setFilter] = useState("All tasks");
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);

  // Close the project menu when clicking outside it
  useEffect(() => {
    if (!openMenu) return undefined;
    function handleClick() { setOpenMenu(false); }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openMenu]);

  // Restore session on mount
  useEffect(() => {
    const stored = getStoredSession();
    if (!stored?.token) return;
    authApi
      .currentUser(stored.token)
      .then(({ user }) => setSession({ token: stored.token, user }))
      .catch(() => localStorage.removeItem("folio-session"))
      .finally(() => setAuthLoading(false));
  }, []);

  // Load projects when session changes
  useEffect(() => {
    if (!session) return undefined;
    let active = true;
    projectApi
      .list(session.token)
      .then(({ projects: result }) => {
        if (!active) return;
        setProjects(result);
        setSelectedProjectId((current) =>
          result.some((project) => project._id === current)
            ? current
            : result[0]?._id || null,
        );
      })
      .catch((error) => active && setPageError(error.message))
      .finally(() => active && setLoadedProjectsFor(session.token));
    return () => { active = false; };
  }, [session]);

  // Load tasks when selected project changes
  useEffect(() => {
    if (!session || !selectedProjectId) {
      startTransition(() => setTasks([]));
      return undefined;
    }
    let active = true;
    startTransition(() => setTasksLoading(true));
    taskApi
      .list(session.token, selectedProjectId)
      .then(({ tasks: result }) => active && setTasks(result))
      .catch((error) => active && setPageError(error.message))
      .finally(() => active && setTasksLoading(false));
    return () => { active = false; };
  }, [session, selectedProjectId]);

  const selectedProject = projects.find(
    (project) => project._id === selectedProjectId,
  );
  const counts = useMemo(
    () =>
      Object.fromEntries([
        ["All tasks", tasks.length],
        ...statuses.map((status) => [
          status,
          tasks.filter((task) => task.status === status).length,
        ]),
      ]),
    [tasks],
  );
  const visibleTasks = tasks.filter(
    (task) =>
      (filter === "All tasks" || task.status === filter) &&
      `${task.title} ${task.description}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  // ── Auth ────────────────────────────────────────────────────────────────────

  function authenticate(result) {
    localStorage.setItem("folio-session", JSON.stringify(result));
    setSession(result);
  }

  function signOut() {
    localStorage.removeItem("folio-session");
    setSession(null);
    setProjects([]);
    setTasks([]);
    setSelectedProjectId(null);
  }

  // ── Project handlers ────────────────────────────────────────────────────────

  function selectProject(id) {
    if (id === selectedProjectId) return;
    setSelectedProjectId(id);
    setTasks([]);
    setFilter("All tasks");
    setSearch("");
  }

  async function saveProject(values) {
    setPageError("");
    setSaving(true);
    try {
      if (dialog.project) {
        const { project } = await projectApi.update(
          session.token,
          dialog.project._id,
          values,
        );
        setProjects((current) =>
          current.map((item) => (item._id === project._id ? project : item)),
        );
      } else {
        const { project } = await projectApi.create(session.token, values);
        setProjects((current) => [project, ...current]);
        setTasks([]);
        setSelectedProjectId(project._id);
      }
      setDialog(null);
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject() {
    if (
      !selectedProject ||
      !window.confirm(`Delete "${selectedProject.name}" and all its tasks?`)
    )
      return;
    setPageError("");
    try {
      await projectApi.remove(session.token, selectedProject._id);
      const remaining = projects.filter(
        (project) => project._id !== selectedProject._id,
      );
      setProjects(remaining);
      setTasks([]);
      setSelectedProjectId(remaining[0]?._id || null);
    } catch (error) {
      setPageError(error.message);
    }
    setOpenMenu(false);
  }

  // ── Task handlers ───────────────────────────────────────────────────────────

  async function saveTask(values) {
    setPageError("");
    setSaving(true);
    try {
      if (dialog.task) {
        const { task } = await taskApi.update(
          session.token,
          dialog.task._id,
          values,
        );
        setTasks((current) =>
          current.map((item) => (item._id === task._id ? task : item)),
        );
      } else {
        const { task } = await taskApi.create(
          session.token,
          selectedProjectId,
          values,
        );
        setTasks((current) => [task, ...current]);
      }
      setDialog(null);
    } finally {
      setSaving(false);
    }
  }

  async function updateTaskStatus(task, status) {
    setPageError("");
    try {
      const { task: updated } = await taskApi.update(
        session.token,
        task._id,
        { status },
      );
      setTasks((current) =>
        current.map((item) => (item._id === updated._id ? updated : item)),
      );
    } catch (error) {
      setPageError(error.message);
    }
  }

  async function deleteTask(task) {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    setPageError("");
    try {
      await taskApi.remove(session.token, task._id);
      setTasks((current) => current.filter((item) => item._id !== task._id));
    } catch (error) {
      setPageError(error.message);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  if (authLoading)
    return (
      <main className="boot-screen">
        <span className="brand-mark">
          <FolderKanban size={19} />
        </span>
        <span>Opening your workspace…</span>
      </main>
    );

  if (!session) return <AuthScreen onAuthenticated={authenticate} />;

  return (
    <div className="workspace">
      <Sidebar
        session={session}
        projects={projects}
        selectedProjectId={selectedProjectId}
        projectsLoading={projectsLoading}
        onSelectProject={selectProject}
        onCreateProject={() => setDialog({ type: "project" })}
        onSignOut={signOut}
      />
      <main className="main-panel">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>{selectedProject?.name || "Projects"}</strong>
          </div>
          <div className="topbar-actions">
            <span className="today-label">A clear view of what's next</span>
            <span className="user-initial">
              {session.user.name.slice(0, 1).toUpperCase()}
            </span>
          </div>
        </header>
        <section className="content-wrap">
          {pageError && (
            <div className="page-error" role="alert">
              <span>{pageError}</span>
              <button
                type="button"
                onClick={() => setPageError("")}
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}
          {projectsLoading ? (
            <div className="loading-state">
              <span className="spinner" />
              Loading your projects…
            </div>
          ) : selectedProject ? (
            <>
              <ProjectHeader
                project={selectedProject}
                tasks={tasks}
                counts={counts}
                openMenu={openMenu}
                onToggleMenu={() => setOpenMenu((open) => !open)}
                onEditProject={() => {
                  setDialog({ type: "project", project: selectedProject });
                  setOpenMenu(false);
                }}
                onDeleteProject={deleteProject}
                onNewTask={() => setDialog({ type: "task" })}
              />
              <TaskSection
                tasks={tasks}
                visibleTasks={visibleTasks}
                tasksLoading={tasksLoading}
                filter={filter}
                search={search}
                counts={counts}
                onFilterChange={setFilter}
                onSearchChange={setSearch}
                onEditTask={(task) => setDialog({ type: "task", task })}
                onDeleteTask={deleteTask}
                onUpdateTaskStatus={updateTaskStatus}
                onNewTask={() => setDialog({ type: "task" })}
              />
              <footer className="content-footer">
                <span>
                  Showing {visibleTasks.length} of {tasks.length} tasks
                </span>
                <span>
                  One step at a time <span className="footer-flower">✳</span>
                </span>
              </footer>
            </>
          ) : (
            <section className="welcome-empty">
              <div className="welcome-icon">
                <FolderKanban size={26} />
              </div>
              <p className="eyebrow">YOUR WORKSPACE IS READY</p>
              <h1>Start with a project.</h1>
              <p>
                Give your work a home. Tasks and progress will live here,
                organized around what matters.
              </p>
              <Button
                icon={Plus}
                onClick={() => setDialog({ type: "project" })}
              >
                Create your first project
              </Button>
            </section>
          )}
        </section>
      </main>
      {dialog && (
        <FormDialog
          key={dialog.project?._id || dialog.task?._id || dialog.type}
          type={dialog.type}
          initial={dialog.project || dialog.task}
          loading={saving}
          onClose={() => setDialog(null)}
          onSave={dialog.type === "project" ? saveProject : saveTask}
        />
      )}
    </div>
  );
}
