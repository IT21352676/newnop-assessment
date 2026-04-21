# Flop-Nop

Welcome to **Flop-Nop**, a powerful and interactive Kanban-style dashboard and issue tracking environment. This project provides a full-stack solution featuring a highly responsive user interface with drag-and-drop capabilities, intelligent AI issue triage support, and real-time dashboard analytics.

## 🌟 Overview

The Flop-Nop platform allows teams to manage development workflows frictionlessly. Built with robust, modern web technologies, it features automated AI insights (via Groq and OpenRouter) that can identify missing information in tickets and streamline triage, seamless state management across the board, and a highly interactive UI.

## ✨ Key Features

- **Interactive Kanban Board**: Fully functional drag-and-drop board for seamless issue status updates using `@dnd-kit`.
- **AI-Powered Triage Support**: Integrates intelligently with OpenRouter AI out of the box to offer suggestions and spot missing report details directly on issues.
- **Dynamic Theming & Aesthetics**: Glassmorphism visuals, smooth motion animations with Framer Motion, and a heavily optimized Tailwind CSS 4 setup.
- **Robust Authentication**: Secured API endpoints powered by NestJS paired with JWT authentication strategies.
- **Data Export & Insights**: Track key analytics or generate actionable reporting insights directly from the dashboard view.

## 🏗️ Architecture & Structure

This repository is structured as a mono-repo. It contains a separate Node/NestJS backend API and a React/Vite frontend client.

```text
newnop-assessment/
├── backend/            # NestJS API application securely handling data, auth, and AI integrations
├── frontend/           # React 19 + Vite SPA (Single Page Application) dashboard
├── .github/            # GitHub Action workflows/CI configs
└── README.md           # Project architecture and overview
```

### Components Summary

| Component | Tech Stack | Responsibility | Port (Default) |
| :--- | :--- | :--- | :--- |
| **Backend** | NestJS, TypeORM, MySQL, OpenRouter, Slack Web API | Handles API requests, Authentication, Database interactions, AI SDK calls | `3000` |
| **Frontend** | React 19, Vite, Tailwind 4, Zustand, DnD Kit | End-user interface, Drag & Drop state management, complex dashboards | `3001` |

## 🚀 Getting Started

The application is split into two parts, and both must be configured and running simultaneously for the full experience. Start by preparing your environment:

### **1. Backend API Configuration**
Please read the [Backend Readme](./backend/README.md) for detailed dependencies and setup instructions.

```bash
cd backend
npm install
cp .env.example .env     # Then configure your DB and Groq/OpenRouter keys
npm run start:dev
```

### **2. Frontend Dashboard Setup**
Please read the [Frontend Readme](./frontend/README.md) for setup specifics. You must route your API to the active backend instance.

```bash
cd frontend
npm install
cp .env.example .env     # Then configure VITE_API_URL=http://localhost:3000
npm run dev
```

*(You will then be able to view the app directly in your browser, likely at `http://localhost:3001`)*

## 🤝 Contributing

When contributing to this repository, please first ensure all existing Jest backend tests and frontend typechecks succeed:

```bash
# Verify backend
cd backend && npm run test

# Verify frontend types
cd frontend && npm run lint
```
