# 🧰 Phase 3 — Build Log & Development Journal

> _"Building something is not just about writing code — it's about discovering clarity through iteration."_

---

## 🪜 Overview

This phase covers the **hands-on development journey** of **MindMesh** — from scaffolding the project to implementing interactive graph features, connecting the backend, and refining the user experience.

Each log entry represents a key milestone in development, along with decisions, challenges, and reflections.

---

## 📅 Phase 1 — Project Setup & Foundation

### ✅ Goals

- Initialize the project structure
- Configure React, TypeScript, and Vite
- Set up Tailwind CSS and Legend State
- Prepare Express + MongoDB backend

### 🧩 Progress

- Created `mindmesh` project using Vite
- Installed core dependencies:
  ```bash
  npm install react-flow-renderer legend-state tailwindcss framer-motion axios express mongoose
  ```
- Initialized backend folder with Express and connected to MongoDB Atlas
- Set up Tailwind and global CSS utilities
- Defined Graph model using Mongoose

### ⚙️ Key Files

```
src/
  ├── main.tsx
  ├── components/
  ├── state/
  ├── services/
backend/
  ├── models/Graph.js
  ├── routes/graphRoutes.js
  └── server.js
```

### 💭 Reflection

"Setting up the base stack was smooth. Legend State feels like the missing piece between simplicity and performance — way cleaner than Redux."

---

## 📅 Phase 2 — Graph Editor Core

### ✅ Goals

- Integrate React Flow into the main workspace
- Connect graph data to Legend State
- Support node creation and deletion

### 🧩 Progress

- Added GraphEditor component powered by React Flow
- Created a graphStore using Legend State:

```ts
import { createStore } from "@legendapp/state";

export const graphStore = createStore({
  nodes: [],
  edges: [],
});
```

- Connected store to React Flow's nodes and edges props
- Added toolbar for adding and removing nodes dynamically

### 🖼️ Screenshot

_(You can insert a screenshot here later once UI is visible)_

### 💭 Reflection

"It's incredibly satisfying seeing the first nodes appear and move around. The live reactivity is instant — it really feels like thinking on a digital canvas."

---

## 📅 Phase 3 — Backend Connection

### ✅ Goals

- Implement full CRUD for graphs in Express
- Integrate frontend with backend using Axios
- Add graph persistence in MongoDB

### 🧩 Progress

- Created `/api/graphs` endpoints:

  - `GET /api/graphs/:userId`
  - `POST /api/graphs`
  - `PUT /api/graphs/:id`
  - `DELETE /api/graphs/:id`

- Set up `.env` for MongoDB URI
- Connected Legend State updates with Axios sync (debounced)

```ts
useEffect(() => {
  const timeout = setTimeout(() => {
    axios.put(`/api/graphs/${graphId}`, graphStore.get());
  }, 2000);
  return () => clearTimeout(timeout);
}, [graphStore.nodes, graphStore.edges]);
```

### 💭 Reflection

"The live sync made the app feel alive. Mongo's flexible schema made graph storage effortless — no migration stress."

---

## 📅 Phase 4 — UX Enhancements

### ✅ Goals

- Improve UI/UX for smoother experience
- Add motion and transitions using Framer Motion
- Implement theme toggle (light/dark)

### 🧩 Progress

- Added subtle node hover animations
- Designed minimalist toolbar with Tailwind & icons
- Implemented dark mode toggle stored in Legend State

```ts
const uiStore = createStore({ theme: "light" });
```

- Added fade-in transitions and spring animations for nodes

### 💭 Reflection

"UI polish transforms the experience. Even small motion tweaks make the graph editor feel premium and alive."

---

## 📅 Phase 5 — Persistence & Polish

### ✅ Goals

- Finalize CRUD operations with error handling
- Add loading placeholders and empty states
- Test database sync and optimize performance

### 🧩 Progress

- Added loading shimmer when fetching graphs
- Improved data validation on backend routes
- Added confirmation modals for graph deletion
- Integrated error boundary in frontend

### 💭 Reflection

"Polish week revealed edge cases — syncing conflicts, debounce timing, and API race conditions. Solving them taught me a lot about async consistency."

---

## 🧩 Technical Learnings

| Category         | Takeaway                                                          |
| ---------------- | ----------------------------------------------------------------- |
| **Legend State** | Effortless reactivity. Perfect for graph-style UIs.               |
| **React Flow**   | Easy to use, customizable, but requires attention to performance. |
| **MongoDB**      | Flexible for dynamic graph structures. Great for prototyping.     |
| **UX Motion**    | Subtle motion = perceived quality.                                |
| **Architecture** | Keeping backend lightweight improved maintainability.             |

---

## 🚀 Milestone Summary

| Phase                | Progress    |
| -------------------- | ----------- |
| ✅ Setup & Structure | Done        |
| ✅ Graph Editor      | Done        |
| ✅ Backend CRUD      | Done        |
| ✅ Sync Integration  | Done        |
| 🔧 UI Polish         | In Progress |
| 🧠 Case Study        | Upcoming    |

---

## 🔭 Next Steps

| Step                             | Focus                                                    |
| -------------------------------- | -------------------------------------------------------- |
| 🎨 **Phase 4 — Polish & Deploy** | Optimize UI, add responsive layout, and deploy to Vercel |
| 📚 **Phase 5 — Case Study**      | Write documentation and project insights                 |
