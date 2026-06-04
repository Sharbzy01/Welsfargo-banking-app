# Backend API for Welsfargo Banking App

Express.js server with PostgreSQL database and JWT authentication.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Project Structure

- `src/server.ts` - Main server file
- `src/controllers/` - Request handlers
- `src/models/` - Database models
- `src/routes/` - API routes
- `src/middlewares/` - Authentication and other middleware
- `migrations/` - Database schema