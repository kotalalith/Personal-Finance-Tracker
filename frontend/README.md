# Frontend Documentation

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Build

```bash
npm run build
```

## Environment Variables (Optional)

Create a `.env` file:

```
VITE_API_URL=http://localhost:5000/api
```

If not provided, the default is `http://localhost:5000/api`

## Features

- React Router for navigation
- Redux Toolkit for state management
- Tailwind CSS for styling
- Recharts for data visualization
- Dark/Light mode toggle
- Responsive design

## Components

- **Layout**: Main application layout with sidebar and header
- **Sidebar**: Navigation sidebar with menu items
- **Header**: Header with theme toggle
- **ProtectedRoute**: Route protection for authenticated routes

## Pages

- **Login**: User authentication
- **Signup**: User registration
- **Dashboard**: Financial overview with charts
- **Transactions**: Transaction management (CRUD)
- **Budgets**: Budget management and progress tracking
- **Reports**: Monthly reports with export functionality
- **Insights**: AI-driven financial insights
