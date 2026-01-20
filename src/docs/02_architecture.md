# 🏗️ Phase 2 — Architecture & System Design

> _"If ideation is the dream, architecture is the translation of that dream into logic."_

---

## 🔍 Project Overview

**Project Name:** MindMesh  
**Goal:** Build a node-based knowledge graph tool where users can visually create, connect, and organize ideas.

MindMesh combines the power of **React Flow** for visualization, **Legend State** for state management, and **MongoDB** for persistence — creating a seamless bridge between thought and technology.

---

## ⚙️ Tech Stack Overview

| Layer                | Technology                   | Purpose                              |
| -------------------- | ---------------------------- | ------------------------------------ |
| **Frontend**         | React + TypeScript + Vite    | Fast, modern, and type-safe          |
| **Visualization**    | React Flow                   | Interactive graph rendering          |
| **State Management** | Legend State                 | Reactive state with minimal overhead |
| **Styling**          | Tailwind CSS + Framer Motion | Modern styling and smooth animation  |
| **Backend**          | Node.js + Express            | RESTful API and business logic       |
| **Database**         | MongoDB (Atlas)              | Flexible schema for graph data       |
| **Deployment**       | Vercel + Mongo Atlas Cloud   | Seamless CI/CD and cloud database    |

---

## 🧩 Core Architecture Diagram

```
      ┌────────────────────────────┐
      │         Frontend           │
      │   React + Legend State     │
      │   (React Flow Graph UI)    │
      └────────────┬───────────────┘
                   │
                   ▼
      ┌────────────────────────────┐
      │          Backend            │
      │ Node.js + Express API Layer │
      │ Handles CRUD, auth, sync    │
      └────────────┬───────────────┘
                   │
                   ▼
      ┌────────────────────────────┐
      │          Database           │
      │      MongoDB (Atlas)        │
      │ Stores graphs, nodes, edges │
      └────────────────────────────┘
```

---

## 🗃️ Data Model (Mongoose Schema)

### Graph Schema

```js
{
  _id: ObjectId,
  userId: String,
  title: String,
  nodes: [
    {
      id: String,
      label: String,
      position: { x: Number, y: Number },
      color: String,
      data: Object
    }
  ],
  edges: [
    {
      id: String,
      source: String,
      target: String,
      label?: String
    }
  ],
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔁 API Endpoints

| Method | Endpoint               | Description                 |
| ------ | ---------------------- | --------------------------- |
| GET    | `/api/graphs/:userId`  | Fetch all graphs for a user |
| GET    | `/api/graphs/:graphId` | Fetch a single graph        |
| POST   | `/api/graphs`          | Create a new graph          |
| PUT    | `/api/graphs/:graphId` | Update an existing graph    |
| DELETE | `/api/graphs/:graphId` | Delete a graph              |

---

## 🧠 State Flow (Frontend)

1. **User Interaction:**  
   A user adds, moves, or connects nodes in the React Flow UI.

2. **Local State Update:**  
   Legend State instantly reflects changes in the UI — no lag, no unnecessary re-renders.

3. **Debounced Sync:**  
   Changes are queued and sent to the backend every few seconds for persistence.

4. **Server Storage:**  
   The backend saves the updated graph in MongoDB and returns the updated data.

5. **Realtime Updates (Future):**  
   Future implementation could include WebSocket sync for multi-user collaboration.

---

## 🧩 Component Hierarchy

```
<App />
 ├── <Navbar />
 ├── <Sidebar />
 ├── <GraphEditor />    ← React Flow Canvas
 │     ├── <Node />
 │     ├── <Edge />
 │     └── <MiniMap />
 ├── <GraphDetails />
 └── <SettingsPanel />
```

Each node and edge is tied to a reactive store (Legend State), ensuring that the UI always reflects the latest state without manual re-render control.

---

## 🪄 Sync Strategy

| Action       | Trigger            | Sync Type | Description                   |
| ------------ | ------------------ | --------- | ----------------------------- |
| Node Create  | Add node to canvas | Debounced | Sends after small delay       |
| Node Move    | Drag event end     | Batched   | Updates positions in backend  |
| Edge Connect | On connect event   | Immediate | Adds new connection instantly |
| Tag Edit     | Manual edit        | Debounced | Updates metadata              |

---

## 🧭 Design Decisions

**Legend State for Reactivity:**  
Instead of Redux or Zustand, Legend State provides automatic granular reactivity and shared stores that scale perfectly for node graphs.

**React Flow for Visualization:**  
Handles edge logic, connection lines, and canvas zooming efficiently.

**MongoDB Flexibility:**  
The graph structure is dynamic; Mongo's document-based model is ideal for storing arbitrary node-edge relationships.

**Backend Separation:**  
Backend focuses only on persistence and validation — frontend handles most interactions locally for a fast feel.

---

## 🔮 Future-Proofing

- **WebSocket Integration:** Real-time collaborative graph editing
- **Versioning System:** Track graph changes over time
- **AI Assistant:** Suggest relationships between disconnected nodes
- **Export Formats:** Support .json, .png, and .svg graph exports

---

## 🧱 Next Steps

| Phase                            | Focus                                                       |
| -------------------------------- | ----------------------------------------------------------- |
| 🧰 **Phase 3 — Build Log**       | Begin development of frontend components and backend routes |
| 🎨 **Phase 4 — Polish & Deploy** | Refine UX, animations, and prepare deployment               |
