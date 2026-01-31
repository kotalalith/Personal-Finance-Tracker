# Personal Finance Tracker

A comprehensive digital personal finance tracker application that simplifies expense tracking and provides insights into spending habits.

## Features

- ✅ Income and expense tracking
- ✅ Category-based budget visualization
- ✅ Monthly summary reports
- ✅ Budget goal setting
- ✅ AI-driven financial insights module

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- Redux Toolkit
- Recharts for data visualization
- Axios for API communication
- Lucide React for icons

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

## Project Structure

```
personal-finance-tracker/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── store/
    │   ├── utils/
    │   └── App.jsx
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/personal-finance-tracker
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
OPENAI_API_KEY=your_openai_api_key_here_if_using_ai_insights
```

4. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

1. **Sign Up/Login**: Create an account or login with existing credentials
2. **Dashboard**: View your financial overview with charts and statistics
3. **Transactions**: Add, edit, and delete income and expense transactions
4. **Budgets**: Set monthly/weekly budget goals per category
5. **Reports**: View monthly summaries and export as PDF or CSV
6. **Insights**: Get AI-driven insights about your spending patterns

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Transactions
- `GET /api/transactions` - Get all transactions (with filters)
- `GET /api/transactions/:id` - Get a single transaction
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction

### Budgets
- `GET /api/budgets` - Get all budgets (with month/year filter)
- `POST /api/budgets` - Create a new budget
- `PUT /api/budgets/:id` - Update a budget
- `DELETE /api/budgets/:id` - Delete a budget

### Reports
- `GET /api/reports/monthly` - Get monthly summary report
- `GET /api/reports/export/csv` - Export transactions as CSV
- `GET /api/reports/export/pdf` - Get PDF export data

### Insights
- `GET /api/insights` - Get AI-driven financial insights

## Categories

**Income Categories**: Salary, Freelance, Investment, Other
**Expense Categories**: Food, Travel, Bills, Shopping, Entertainment, Health, Education, Other

## Security

- Passwords are hashed using bcrypt
- JWT tokens for secure authentication
- Protected routes require authentication
- Password validation (minimum 6 characters)

## Dark Mode

The application includes a dark/light mode toggle that persists across sessions.

## License

ISC
