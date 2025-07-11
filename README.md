# Full-stack boilerplate

## Tech Stack
  - Frontend:
      - Typescript
      - React
      - UI via [tailwind](https://tailwindcss.com/) and [shadcn](https://ui.shadcn.com/)
  - Backend:
      - Typescript
      - [Fastify](https://fastify.dev/) server
      - Sqlite via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)

## System Requirements
In order to use the boilerplate you will need the following:
- Node.js 20+

## Updated Setup

While the original approach will still work, the repository has been Dockerized for ease of use. The only command necessary to start the application is:

```
make start
```

## Setup
1. Pull the repo
  ```bash
  git clone git@github.com:stepful/interview_template.git && cd interview_template
  ```

2. (Optional) Copy .env.sample to .env (should be sensible defaults, but feel free to make changes as desired)
  ```bash
  cp .env.sample .env
  ```

3. Install packages for all workspaces, and seed DB
  ```bash
  npm run setup
  ```

5. Start dev servers (vite, fastify)
  ```bash
  npm run dev
  ```
  You should now be able to reach the frontend app at http://localhost:3000 (and this port is configurable via `VITE_FRONTEND_SERVER_PORT` in `.env.local`).
  The backend is available at http://localhost:3001 (and this port is configurable via `VITE_BACKEND_SERVER_PORT` in `.env.local`).
