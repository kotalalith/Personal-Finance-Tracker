# Backend API Documentation

## Environment Variables

Create a `.env` file with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/personal-finance-tracker
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
OPENAI_API_KEY=your_openai_api_key_here_if_using_ai_insights
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## Models

### User
- name: String (required)
- email: String (required, unique)
- password: String (required, hashed)

### Transaction
- user: ObjectId (reference to User)
- type: String (enum: 'income', 'expense')
- amount: Number (required, min: 0)
- category: String (required, enum)
- description: String (optional)
- date: Date (required)

### Budget
- user: ObjectId (reference to User)
- category: String (required, enum)
- amount: Number (required, min: 0)
- period: String (enum: 'weekly', 'monthly')
- month: Number (required, 1-12)
- year: Number (required)

## API Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```
