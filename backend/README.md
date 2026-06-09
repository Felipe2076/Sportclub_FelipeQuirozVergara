# 🦍 Gorila Sport Backend - MongoDB Integration

## Overview

This is the Node.js/Express backend for Gorila Sport, now integrated with MongoDB using Mongoose.

## Setup Instructions

### 1. Environment Configuration

Edit `.env` file with your MongoDB connection string:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gorila-sport?retryWrites=true&w=majority
PORT=4000
API_KEY=your-secret-api-key-here
NODE_ENV=development
```

**MongoDB Atlas Setup:**
- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get your connection string
- Replace credentials in `.env`

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

```bash
npm start
```

Expected output:
```
✅ MongoDB connected successfully
🦍 Gorila Sport backend API running on http://localhost:4000
```

## API Endpoints

### Auth Endpoints

**POST /api/register**
- Register a new user
- Body: `{ email, password, name, role, age, practicesSport, sportType, personalGoal, level }`
- Returns: `{ token, user }`

**POST /api/login**
- Login existing user
- Body: `{ email, password }`
- Returns: `{ token, user }`

### Protected Endpoints

**GET /api/dashboard**
- Requires: `x-api-key` header
- Requires: `Authorization: Bearer <token>` header
- Returns: Dashboard data with stats

**GET /api/profile**
- Requires: `Authorization: Bearer <token>` header
- Returns: User profile data

**GET /api/health**
- Health check endpoint
- No authentication required

## Frontend Integration

The frontend automatically connects to `http://localhost:4000/api`.

For dashboard access, include the API key in requests:
```javascript
headers: {
  'x-api-key': 'your-secret-api-key-here',
  'Authorization': `Bearer ${token}`
}
```

## Troubleshooting

### MongoDB Connection Issues
- Verify MONGODB_URI in .env
- Check if MongoDB Atlas cluster is active
- Ensure IP whitelist includes your machine

### Port Already in Use
- Change PORT in .env file
- Or kill process: `netstat -ano | findstr :4000`

### Dependencies Not Installing
- Delete `node_modules` folder
- Run `npm install` again

## Project Structure

```
backend/
├── server.js          # Main Express server
├── models/
│   └── User.js        # Mongoose User model
├── package.json       # Dependencies
├── .env              # Environment variables
└── README.md         # This file
```

---

**Ready to scale! 🚀**
