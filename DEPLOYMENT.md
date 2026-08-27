# 🚀 CineWave Deployment Guide — Vercel & Supabase

This guide walks you through deploying **CineWave**:
- 💻 **Frontend**: Deployed to **Vercel**
- 🛡️ **Backend**: Deployed to **Vercel** / **Render**
- 🗄️ **Database**: Hosted on **Supabase** (Cloud PostgreSQL)

---

## 📑 Table of Contents
1. [Step 1: Set up Supabase Database](#step-1-set-up-supabase-database)
2. [Step 2: Deploy Frontend to Vercel](#step-2-deploy-frontend-to-vercel)
3. [Step 3: Deploy Backend API](#step-3-deploy-backend-api)
4. [Step 4: Configure Production Environment Variables](#step-4-configure-production-environment-variables)
5. [Local Development Reference](#local-development-reference)

---

## 🗄️ Step 1: Set up Supabase Database

1. **Create an Account / Project**:
   - Go to [https://supabase.com](https://supabase.com) and log in.
   - Click **"New Project"**.
   - Choose a project name (e.g., `cinewave`), set a secure database password, and select a region close to your users.

2. **Run the Database Schema**:
   - In your Supabase project dashboard, open the **SQL Editor** from the left navigation.
   - Click **"New Query"**.
   - Copy and paste the entire contents of [`database/schema.sql`](file:///database/schema.sql).
   - Click **"Run"** (Ctrl + Enter). This will create all 10 tables, indexes, and Row-Level Security (RLS) policies.

3. **Populate Initial Catalog & Seeds**:
   - Open another **"New Query"** in the SQL Editor.
   - Copy and paste the contents of [`database/seed.sql`](file:///database/seed.sql).
   - Click **"Run"**. This populates the genres, subscription tiers, demo users, and 4K movies/shows.

4. **Copy API Keys**:
   - Go to **Project Settings** (gear icon) &rarr; **API**.
   - Copy your **Project URL** (e.g., `https://xyzcompany.supabase.co`).
   - Copy your **`anon` `public` key**.
   - Copy your **`service_role` `secret` key**.

---

## 💻 Step 2: Deploy Frontend to Vercel

1. Go to [https://vercel.com](https://vercel.com) and log in with GitHub.
2. Click **"Add New..."** &rarr; **"Project"**.
3. Import your GitHub repository: `https://github.com/majiarnab997-collab/cine_wave`.
4. In the **Project Configuration** screen:
   - **Framework Preset**: Vite
   - **Root Directory**: Click **Edit** and choose `frontend`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   | Variable | Value | Description |
   | :--- | :--- | :--- |
   | `VITE_API_URL` | `https://your-backend-url.vercel.app/api` | Your deployed backend URL |
   | `VITE_SUPABASE_URL` | `https://your-project.supabase.co` | Your Supabase project URL |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Your Supabase public `anon` key |
6. Click **"Deploy"**.
7. Vercel will build and assign you a live production domain (e.g., `https://cine-wave.vercel.app`).

---

## 🛡️ Step 3: Deploy Backend API

### Option A: Deploy Backend to Vercel (Serverless)
1. On Vercel, click **"Add New..."** &rarr; **"Project"**.
2. Select the same repository `majiarnab997-collab/cine_wave`.
3. Set **Root Directory** to `backend`.
4. Add the environment variables:
   | Variable | Value |
   | :--- | :--- |
   | `SUPABASE_URL` | `https://your-project.supabase.co` |
   | `SUPABASE_ANON_KEY` | `eyJhbGciOi...` |
   | `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` |
   | `CORS_ORIGIN` | `https://your-frontend.vercel.app` |
5. Click **"Deploy"**.

### Option B: Deploy Backend to Render / Railway (Dedicated Node.js Server)
1. Go to [https://render.com](https://render.com) &rarr; **New Web Service**.
2. Connect your GitHub repository `cine_wave`.
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add environment variables:
   - `PORT`: `5000`
   - `SUPABASE_URL`: `https://your-project.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY`: `your-service-role-key`
   - `CORS_ORIGIN`: `https://your-frontend.vercel.app`
5. Click **"Create Web Service"**.

---

## 🔑 Step 4: Environment Variables Summary

### `frontend/.env` (Local) / Vercel Frontend
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key
```

### `backend/.env` (Local) / Vercel/Render Backend
```env
PORT=5000
CORS_ORIGIN=http://localhost:5173,https://your-frontend.vercel.app
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-secret-key
```

---

## 💻 Local Development Reference

To run the entire full-stack locally:
```bash
npm run dev
```
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Local Fallback DB**: `database/store.json`
