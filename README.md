# 🎬 CineWave — Full-Stack Video Streaming Platform

A production-grade OTT streaming platform featuring a clean, modular architecture with dedicated **Frontend**, **Backend**, and **Database** directories.

---

## 🗂️ Project Directory Structure

```
new/
├── 💻 frontend/                     # FRONTEND CLIENT (React 19 + TypeScript + Vite + Tailwind)
│   ├── public/                      # Static assets & CineWave SVG favicon
│   ├── src/                         # React components, pages, context, hooks, services
│   ├── package.json                 # Frontend dependencies & build scripts
│   ├── index.html                   # HTML template
│   ├── vite.config.ts               # Vite configuration
│   └── tailwind.config.js           # Design system tokens & animations
│
├── 🛡️ backend/                      # BACKEND REST API SERVER (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── controllers/             # Auth, Media, Profile, Playback, Watchlist, Admin
│   │   ├── routes/                  # Express API Routes (/api/auth, /api/media, /api/admin...)
│   │   ├── models/                  # TypeScript data contracts & interfaces
│   │   ├── db.ts                    # Database interface connecting to database/store.json
│   │   └── index.ts                 # Server entrypoint (listening on Port 5000)
│   ├── package.json                 # Backend dependencies & scripts
│   └── tsconfig.json                # TypeScript server compiler config
│
├── 🗄️ database/                     # PERSISTENT DATABASE LAYER
│   ├── store.json                   # Live persistent JSON database (movies, users, history, logs)
│   └── README.md                    # Database documentation & collection specs
│
├── start-all.js                     # Cross-platform full-stack launcher (Windows / macOS / Linux)
├── package.json                     # Root workspace scripts
└── README.md                        # Master documentation
```

---

## ⚡ How to Run

### Option 1: Start Full-Stack (Frontend + Backend + Database)
From the root folder, simply run:
```bash
npm run dev
```
*(or `node start-all.js`)*

- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend REST API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Database**: `database/store.json`

---

### Option 2: Run Frontend or Backend Individually

#### To run only the Frontend:
```bash
cd frontend
npm run dev
```

#### To run only the Backend:
```bash
cd backend
npm run dev
```

---

## 📡 REST API Endpoints Overview (`http://localhost:5000/api`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & server status |
| `POST` | `/api/auth/login` | User authentication |
| `POST` | `/api/auth/demo` | 1-Click demo logins (*Alex*, *Kids*, *Admin*) |
| `POST` | `/api/auth/signup` | Subscriber registration |
| `GET` | `/api/media` | Catalog filter (genre, type, year, maturity, search) |
| `GET` | `/api/media/featured` | Spotlight hero titles |
| `GET` | `/api/media/trending` | Trending carousel items |
| `GET` | `/api/media/top10` | Top 10 Today titles |
| `GET` | `/api/media/:id` | Single movie or TV series details with episodes |
| `GET` | `/api/profiles/:userId` | Profile management & Kids mode |
| `GET` | `/api/watchlist` | Saved watchlist per profile |
| `POST` | `/api/playback/progress` | Continue watching resume timestamps & history |
| `GET` | `/api/admin/metrics` | Executive KPI analytics & revenue tracking |
| `POST` | `/api/admin/movies` | Create or update movie asset |
| `POST` | `/api/admin/shows` | Create or update TV series asset |
