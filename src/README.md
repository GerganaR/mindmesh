# 🧠 MindMesh Frontend

> Interactive visual knowledge graph built with React + TypeScript

## 📁 Folder Structure

```
src/
├── api/              # API client & HTTP services
├── assets/           # Static assets (images, icons)
├── components/       # Reusable UI components
├── docs/             # Documentation files
├── pages/            # Page-level components
│   ├── DashboardPage.tsx   # Main dashboard view
│   └── EditorPage.tsx      # Graph editor interface
├── types/            # TypeScript type definitions
├── App.tsx           # Root app component & routing
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🧩 Tech Stack

| Technology        | Purpose                                |
| ----------------- | -------------------------------------- |
| **React 19**      | UI framework                           |
| **TypeScript**    | Type safety                            |
| **Vite**          | Build tool & dev server                |
| **React Flow**    | Node-based graph visualization         |
| **Legend State**  | Fine-grained reactive state management |
| **Tailwind CSS**  | Utility-first styling                  |
| **Framer Motion** | Animations & transitions               |
| **React Query**   | Server state & caching                 |
| **Axios**         | HTTP client                            |
| **React Router**  | Client-side routing                    |

## 📄 Pages

### Dashboard (`/`)

The main landing page showing an overview of your knowledge graphs.

### Editor (`/editor`)

The interactive graph editor where you can:

- Create and edit nodes
- Connect nodes with edges
- Drag and rearrange your visual mind map
- Save your work to the database

## 🎨 Styling

This project uses **Tailwind CSS** for styling. Global styles are defined in:

- `index.css` — Base styles and Tailwind imports
- `App.css` — App-specific styles

## 🔧 Development

```bash
# Run linter
npm run lint

# Preview production build
npm run preview
```
