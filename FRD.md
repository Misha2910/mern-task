# Project and Task Tracker — Functional Requirements Document

## 1. Purpose and Scope

Build a small internal web tool for authenticated users to organize projects and track their tasks. The first release supports account registration and login, project management, task management, and task status updates. Each user's projects and tasks are private to that user.

## 2. Feature List

- **Authentication:** Register with name, email, and password; log in with email and password; log out; retain an authenticated session using a JWT.
- **Projects:** List the signed-in user's projects; create, view, edit, and delete a project. A project has a required name and an optional description.
- **Tasks:** Within a project, list, create, view, edit, and delete tasks. A task has a required title, optional description, and status: `Todo`, `In Progress`, or `Done`.
- **Status updates:** Change a task's status from the task list without leaving the project.
- **User interface:** Login and registration forms, a project list, and a project task list. Reusable Button and Input components, controlled forms, loading indicators, and readable error messages are included.
- **API and security:** Express REST API, MongoDB persistence, JWT-protected project/task endpoints, validated request data, and centralized error responses.
- **Documentation and release:** README with setup, environment configuration, folder structure, API summary, deployment URLs, and an AI usage declaration.

## 3. User Flow

1. A new user registers, or an existing user logs in.
2. On successful authentication, the user sees their project list. If there are no projects, they can create one.
3. The user opens a project and sees its tasks, grouped or filterable by status.
4. The user adds or edits a task, or updates its status among `Todo`, `In Progress`, and `Done`.
5. The user can edit or delete their own projects and tasks. Deleting a project also deletes its tasks.
6. The user logs out; protected screens and API operations require signing in again.

## 4. Basic Validations and Error Behavior

- Name, email, password, project name, and task title must not be empty after trimming whitespace.
- Email must have a valid email format and be unique, ignoring case.
- Password must meet a documented minimum length (8 characters); passwords are stored as secure hashes, never as plain text.
- Project/task descriptions are optional and have a reasonable maximum length; project and task titles also have maximum lengths.
- A task status must exactly match one of the three supported values.
- A task must belong to an existing project owned by the signed-in user. Users may only read or change their own projects and tasks; unauthorized access returns an appropriate error without exposing another user's data.
- Invalid input returns a client error with a useful message. Missing/invalid authentication returns an authentication error. Unexpected errors use a centralized handler and do not expose secrets or stack traces to clients.
- Forms show loading state while submitting, prevent duplicate submissions, and show actionable errors when requests fail.

## 5. Assumptions and Out of Scope

- This is a single-tenant application with multiple individual accounts; there are no teams, roles, invitations, or shared projects.
- Each project and task has one owning user; tasks are always contained in a project.
- Project deletion cascades to its tasks. Confirmation is shown before destructive deletes.
- Dates, priorities, attachments, comments, notifications, search, and task assignment are not part of the first release.
- MongoDB connection string, JWT secret, and frontend API base URL are supplied through environment variables. Secrets are not committed to Git.
- Planned deployment targets are Vercel or Netlify for the React frontend, Render for the Express backend, and MongoDB Atlas (or another reachable MongoDB service). Actual public URLs require deployment accounts and configuration.
- AI assistance will be disclosed in the README, including that it was used to help plan and implement the project; the developer remains responsible for reviewing and understanding the code.

## 6. Acceptance Criteria

- A user can register, log in, and access only their own projects and tasks.
- Authenticated users can perform project and task CRUD, and can change task status among the allowed values.
- The UI handles loading, empty, success, and error states and works at common desktop and mobile widths.
- The backend follows the required `src/controllers`, `src/routes`, `src/models`, `src/middleware`, `src/config`, and `src/app.js` structure; route files do not contain business logic.
- Setup and deployment instructions, environment variables, API list, folder explanation, deployment URL placeholders, and AI usage declaration are documented in the README.
