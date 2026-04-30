# Ethara.Ai Team Task Manager

A full-stack Team Task Manager built with Next.js, Prisma, and Tailwind CSS. It features a complete role-based access control (RBAC) system for Admins and Members to manage projects and tasks efficiently.

## Features

- **Authentication**: Secure Signup and Login using JWT stored in HTTP-only cookies.
- **Role-Based Access Control**:
  - **Admin**: Create/edit/delete projects, view all users, manage all tasks, assign tasks.
  - **Member**: View projects, update status of their assigned tasks.
- **Projects Management**: Organize tasks into different projects.
- **Task Board**: Track task status (To Do, In Progress, Done) with due dates and assignments.
- **Dashboard Overview**: See aggregate statistics for tasks (total, pending, completed, overdue).
- **Responsive & Modern UI**: Built with Tailwind CSS, featuring glassmorphism elements, dynamic colors, and smooth micro-animations.

## Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS, Lucide React (Icons).
- **Backend**: Next.js API Routes (RESTful).
- **Database ORM**: Prisma.
- **Database Engine**: SQLite (default for local dev) / PostgreSQL (recommended for production).
- **Authentication**: Custom JWT implementation using `jose` (Edge-compatible).

## Getting Started Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   The project is pre-configured to use SQLite for simple local testing without needing a DB server.
   ```bash
   npx prisma db push
   ```

3. **Seed Initial Data**
   Populate the database with default Admin and Member accounts:
   ```bash
   npx tsx prisma/seed.ts
   ```
   **Test Accounts Created:**
   - Admin: `admin@ethara.ai` | Password: `admin123`
   - Member: `member@ethara.ai` | Password: `member123`

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to view the app.

## Deployment to Railway

This project is fully ready to be deployed to Railway.

1. **Push to GitHub**: Initialize a Git repository and push this code to GitHub.
2. **Connect Railway to GitHub**: Go to [Railway](https://railway.app/), create a New Project > Deploy from GitHub repo.
3. **Important Note on Database**: 
   By default, this uses SQLite. Railway provides ephemeral file systems, meaning the SQLite file will be reset on every deployment. For a persistent, production-ready setup:
   - Add a PostgreSQL database in your Railway project.
   - Update `prisma/schema.prisma`: Change `provider = "sqlite"` to `provider = "postgresql"`.
   - Add a `DATABASE_URL` environment variable in Railway with the PostgreSQL connection string.
   - Add a `JWT_SECRET` environment variable in Railway with a secure random string.
   - Deploy!

## Assignment Requirements Fulfilled
✅ Authentication (Signup/Login)
✅ Project & team management
✅ Task creation, assignment & status tracking
✅ Dashboard (tasks, status, overdue)
✅ REST APIs + Database (Prisma)
✅ Proper validations & relationships
✅ Role-based access control (Admin/Member)
✅ Custom rich styling (Tailwind CSS)
