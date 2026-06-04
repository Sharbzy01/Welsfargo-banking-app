# Welsfargo Banking App

A modern, full-stack banking application built with React, Node.js, Express, and PostgreSQL.

## Features

- 🔐 Secure user authentication with JWT
- 💳 Account management
- 💸 Money transfers between accounts
- 📊 Transaction history
- 📱 Responsive UI
- 🛡️ Role-based access control

## Tech Stack

### Frontend
- React 18+
- TypeScript
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT for authentication

## Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Sharbzy01/Welsfargo-banking-app.git
cd Welsfargo-banking-app
```

2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
.
├── backend/          # Express server and API
├── frontend/         # React application
└── docker-compose.yml
```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Accounts
- `GET /api/accounts` - Get user accounts
- `GET /api/accounts/:id` - Get account details
- `POST /api/accounts` - Create new account

### Transactions
- `GET /api/transactions` - Get transaction history
- `POST /api/transactions/transfer` - Transfer funds

## License

MIT