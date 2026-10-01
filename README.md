# Folio Project Tracker

Folio is a private project and task tracker. Users can register, manage their own projects, add tasks, and update task status across Todo, In Progress, and Done.

## Tech Stack

- Frontend: React 19, Vite, React Router, Lucide icons
- Backend: Node.js, Express, Mongoose, JWT authentication, Zod validation
- Database: MongoDB
- Deployment targets: Vercel or Netlify (frontend), Render (backend), MongoDB Atlas (database)

## Requirements

- Node.js 20.19+ or 22.12+ and npm
- A MongoDB connection: local MongoDB or a MongoDB Atlas cluster

## Local Setup

1. Open a terminal in the `MP` project folder.
2. Install all dependencies:

   ```bash
   npm install
   npm install --prefix backend
   npm install --prefix frontend
   ```

3. Copy `backend/.env.example` to `backend/.env`. For quick local testing, keep `USE_MEMORY_DB=true`; this starts a temporary MongoDB that resets when the backend stops, so no Atlas account is needed. For persistent data, set `USE_MEMORY_DB=false` and set `MONGODB_URI` to your Atlas connection string. Replace `JWT_SECRET` with a private random value of at least 32 characters. Never commit `.env` files.
4. Copy `frontend/.env.example` to `frontend/.env`. For local development, the default API URL is already correct.
5. Start MongoDB, if using a local database.
6. From the `MP` folder, run:

   ```bash
   npm run dev
   ```

7. Open the Vite URL shown in the terminal, usually `http://localhost:5173`. Register a user and create a project.

Useful commands from the project folder:

- `npm run dev`: start frontend and backend together
- `npm run dev:web`: start only the frontend
- `npm run dev:api`: start only the backend
- `npm run build`: create the frontend production bundle
- `npm run format --prefix frontend`: format frontend source with Prettier
- `npm test`: run backend tests

The API health endpoint is `http://localhost:5050/api/health`. The backend exits with a clear configuration error if `MONGODB_URI` or a sufficiently long `JWT_SECRET` is missing.

## Folder Structure

```text
MP/
├── FRD.md
├── backend/
│   ├── src/
│   │   ├── config/       MongoDB connection
│   │   ├── controllers/  Request handlers and application operations
│   │   ├── middleware/   JWT authentication, validation, and errors
│   │   ├── models/       Mongoose User, Project, and Task models
│   │   ├── routes/       HTTP route declarations only
│   │   ├── app.js        Express app and middleware wiring
│   │   └── server.js     Environment loading, database startup, listener
│   └── test/             Backend tests
└── frontend/
    ├── src/
    │   ├── components/   Reusable Button, Field, and Modal controls
    │   ├── api.js        Centralized API client
    │   ├── App.jsx       Authenticated project/task workspace
    │   └── AuthScreen.jsx Login and registration forms
    └── .env.example
```

## API Summary

All application endpoints are under `/api`. Protected endpoints require `Authorization: Bearer <token>`.

| Method | Path | Purpose | Auth |
| --- | --- | --- | --- |
| GET | `/health` | Health check | No |
| POST | `/auth/register` | Create account | No |
| POST | `/auth/login` | Sign in | No |
| GET | `/auth/me` | Get current user | Yes |
| GET, POST | `/projects` | List or create projects | Yes |
| GET, PATCH, DELETE | `/projects/:projectId` | Read, update, or delete a project | Yes |
| GET, POST | `/projects/:projectId/tasks` | List or create project tasks | Yes |
| GET, PATCH, DELETE | `/tasks/:taskId` | Read, update, or delete a task | Yes |

Project deletion also deletes its tasks. API responses only include data owned by the authenticated user.

## Deployment

Public URLs are not available until you create deployment accounts and connect a GitHub repository. After deployment, replace these placeholders with the real URLs:

- Frontend (Vercel or Netlify): `Not deployed yet`
- Backend (Render): `Not deployed yet`
- Public API base URL: `Not deployed yet`

### Backend on Render

1. Push this project to a GitHub repository you own.
2. In Render, create a Web Service connected to that repository. Set the root directory to `backend`, build command to `npm install`, and start command to `npm start`.
3. Add `MONGODB_URI` using your MongoDB Atlas connection string, `JWT_SECRET` using a private random string of at least 32 characters, and `FRONTEND_URL` using the deployed frontend origin. `PORT` is provided by Render.
4. Deploy and check `https://<your-render-service>.onrender.com/api/health`.

### Frontend on Vercel or Netlify

1. Import the same GitHub repository into Vercel or Netlify and set the project/root directory to `frontend`.
2. Use `npm install` as the install command and `npm run build` as the build command. The output directory is `dist`.
3. Set `VITE_API_URL` to the Render API base URL ending in `/api`, for example `https://<your-render-service>.onrender.com/api`.
4. Redeploy after setting the environment variable. Add the final frontend origin to Render's `FRONTEND_URL` and redeploy the backend.
5. Test account registration, sign-in, project/task creation, status updates, and refresh behavior on the deployed site.

Deployment troubleshooting: confirm the frontend API URL includes `/api`; the backend CORS origin exactly matches the deployed frontend origin; Atlas allows the Render service to connect; all secrets are configured in the correct service; and a frontend redeploy occurred after changing `VITE_API_URL`. Never put MongoDB credentials or the JWT signing secret in `VITE_` variables.

## AI Usage Declaration

AI assistance was used to help draft the functional requirements, scaffold and implement the application, and prepare setup and deployment documentation. The developer should review the code, understand the authentication and deployment configuration, and verify the deployed application before submission.