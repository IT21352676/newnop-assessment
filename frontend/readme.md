# Flop-Nop Frontend

This is the frontend interface for the **Flop-Nop** application, an interactive Kanban-style dashboard and issue tracking environment.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & Radix UI
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Routing**: React Router DOM (v7)
- **Interactions & Animations**: DnD Kit (Drag and Drop), Motion (Animations)

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:
- **Node.js**: v18.x or higher
- **npm** or **yarn** or **pnpm**

## ⚙️ Setup Instructions

**1. Clone the repository and navigate to the frontend directory**

```bash
cd frontend
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure Environment Variables**

Create a `.env` file in the root of the `frontend` directory. You can use the `.env.example` as a template:

```bash
cp .env.example .env
```

Provide the URL to your backend API application in the `.env` file:

```env
# Route to backend API application
VITE_API_URL=http://localhost:3000
```

## 🛠️ Usage

### Local Development

To start the local development server (running on `0.0.0.0:3001` by default):

```bash
npm run dev
```

### Production Build

To build the application for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## ✨ Key Features

- **Kanban Board Configuration**: Fully featured grid layout powered by `@dnd-kit`.
- **Intelligent Issue Management**: Integrate with the backend's AI services for automated guidance.
- **Dynamic Theming**: Utilizes structured Tailwind variables for sleek visual feedback.
