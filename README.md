# 🦍 Gorila Sport - MongoDB Integration

Complete sports club management platform with Express backend and MongoDB database integration.

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
npm install
# Edit .env with your MongoDB connection string
npm start
```

Server runs on `http://localhost:4000`

### Frontend Setup

Open `index.html` with Live Server or your preferred HTTP server.

**Frontend runs on:** `http://localhost:5500` (Live Server default)

## 📋 Features

- ✅ User registration and authentication with bcrypt
- ✅ Three user roles: Admin, Coach, User (Athlete)
- ✅ MongoDB integration with Mongoose ORM
- ✅ RESTful API with Express
- ✅ Personalized dashboards by role
- ✅ Modern responsive UI with custom CSS
- ✅ Secure API key middleware

## 📁 Project Structure

```
Gorila Sport/
├── index.html                 # Home page
├── login.html                 # Login page
├── register.html              # Registration page
├── dashboard_admin.html       # Admin dashboard
├── dashboard_coach.html       # Coach dashboard
├── dashboard_usuario.html     # Athlete dashboard
├── css/
│   ├── home.css              # Home page styles
│   └── styles.css            # Main stylesheet
├── js/
│   ├── auth.js               # Authentication logic
│   ├── dashboard.js          # Dashboard logic
│   └── recover.js            # Password recovery
├── backend/                  # Express/MongoDB backend
│   ├── server.js             # Main server
│   ├── models/
│   │   └── User.js           # Mongoose User model
│   ├── package.json          # Backend dependencies
│   ├── .env                  # Environment variables
│   └── README.md             # Backend setup guide
└── assets/
    └── logo-gorila.svg       # Gorila Sport logo
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register new user |
| POST | `/api/login` | Login user |
| GET | `/api/dashboard` | Get dashboard data (requires API key) |
| GET | `/api/profile` | Get user profile |
| GET | `/api/health` | Health check |

## 🔐 Authentication

- Passwords hashed with bcrypt (10 rounds)
- Token-based authentication (Bearer tokens in localStorage)
- API key middleware for dashboard protection

## 📖 Documentation

See `QUICK_START.md` for detailed setup and usage instructions.
See `backend/README.md` for MongoDB and API configuration.

## 🛠 Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** bcrypt, JWT tokens
- **API:** RESTful HTTP

---

**Built with 🦍 Gorila Power!**