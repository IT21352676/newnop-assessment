# Flop-Nop Backend

This is the backend service for the **Flop-Nop** application, built using the [NestJS](https://nestjs.com/) framework. It provides RESTful APIs and real-time WebSocket communication to support the frontend application.

## 🚀 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: TypeScript
- **Database**: MySQL (via TypeORM)
- **Authentication**: JWT & bcrypt
- **External Integrations**: OpenRouter SDK, Slack Web API

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:
- **Node.js**: v18.x or higher
- **npm** or **yarn** or **pnpm**
- **MySQL**: A running MySQL database instance

## ⚙️ Setup Instructions

**1. Clone the repository and navigate to the backend directory**

```bash
cd backend
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure Environment Variables**

Create a `.env` file in the root of the `backend` directory based on the provided `.env.example`:

```bash
cp .env.example .env
```

Populate the `.env` file with your configuration:

```env
# Nest js
JWT_SECRET=your_jwt_secret_key
PORT=3000

# Groq / OpenRouter AI
GROQ_API_KEY=your_api_key_here

# Dashboard
OPTIONAL_FIELDS_COUNT=3 # default is 3

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_NAME=flopnop_db
```

## 🛠️ Usage

### Local Development

To start the application in development mode with live reload:

```bash
npm run start:dev
```

### Production Build

To build and run the application for production:

```bash
npm run build
npm run start:prod
```

## 🧪 Testing

The project includes standard Jest configuration for unit and end-to-end tests:

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```
