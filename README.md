# 🌱 EcoLearn
**EcoLearn** is a full-stack MERN application designed to make environmental education more interactive through quizzes, challenges, gamification, and community-driven learning.
The platform allows users to learn about environmental topics, complete quizzes and real-world challenges, earn points, unlock achievements, and compete on leaderboards.

---

## 📖 Overview
Environmental education is often presented through static content, making it difficult to keep learners engaged.
EcoLearn addresses this by combining **learning with gamification**.
Users can:
* Create and manage their accounts
* Verify their email address
* Learn through environmental quizzes
* Participate in environmental challenges
* Earn EcoPoints
* Progress through different levels
* Unlock badges and achievements
* Track their learning activity
* View their performance
* Compete on leaderboards
* Manage their profile
The application is built using a **MERN stack architecture**, with React handling the frontend and Node.js/Express.js powering the backend API.

---

## ✨ Key Features

### 🔐 Authentication
* User registration and login
* JWT-based authentication
* Email verification
* Password reset
* Protected routes
* Secure password hashing
* User profile management

### 🧠 Environmental Quizzes
Users can take quizzes covering different environmental topics and difficulties.
Quiz results contribute to the user's overall progress and EcoPoints.

### 🌍 Environmental Challenges
Users can participate in real-world environmental challenges.
Challenges encourage users to apply what they learn outside the application and submit their completed activities for verification.

### 🎮 Gamification
EcoLearn uses gamification to encourage continued participation.
Users can:
* Earn EcoPoints
* Increase their level
* Maintain progress
* Unlock badges
* Track achievements

### 🏆 Leaderboards
Users can compare their EcoPoints and ranking with other learners.
Leaderboards provide an additional competitive element to the learning experience.

### 👤 User Profiles
Users have profiles containing information such as:
* Name
* Email
* School
* Grade
* Location
* Bio
* Level
* EcoPoints
* Badges
* Activity information

### 📧 Email Notifications
The application uses a third-party email delivery service for system-generated emails such as:
* Email verification
* Password reset
* Welcome emails
* Other application notifications
Email delivery is separated from the main application logic through an email service layer.
> When running your own instance of EcoLearn, you must configure your own email provider credentials through environment variables.

---

# 🛠️ Technology Stack

## Frontend
* **React**
* **React Router**
* **Axios**
* **TanStack React Query**
* **Tailwind CSS**
* **Framer Motion**
* **Lucide React**

## Backend
* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JWT**
* **bcryptjs**
* **Multer**
* **Express Validator**

## Other Services
* Third-party transactional email service
* SMTP/Nodemailer support
* Cloud-based media storage integration

---

# 🏗️ Architecture
EcoLearn follows a standard client-server architecture.
```text
                 ┌───────────────────┐
                 │    React Client   │
                 │                   │
                 │ Pages             │
                 │ Components        │
                 │ Services          │
                 └─────────┬─────────┘
                           │
                           │ REST API
                           ▼
                 ┌───────────────────┐
                 │   Express Server  │
                 │                   │
                 │ Routes            │
                 │ Middleware        │
                 │ Controllers       │
                 │ Services          │
                 └─────────┬─────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
        ┌──────────┐  ┌──────────┐  ┌────────────┐
        │ MongoDB  │  │  Email   │  │   Media    │
        │          │  │ Service  │  │  Storage   │
        └──────────┘  └──────────┘  └────────────┘
```
The frontend communicates with the backend through REST APIs, while the backend handles authentication, business logic, database operations, gamification, and communication with external services.

---

# 📁 Project Structure
```text
ecoLearn/
│
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── styles/
│       ├── utils/
│       └── App.jsx
│
├── server/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── data/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── scripts/
│       ├── templates/
│       ├── uploads/
│       └── utils/
│
├── LICENSE
└── README.md
```
The project is divided into two main applications:
### `client`
Contains the React frontend, including pages, components, API services, hooks, context and UI utilities.
### `server`
Contains the Express backend, including routes, controllers, MongoDB models, middleware, authentication logic and external service integrations.

---

# 🔑 Authentication Flow
The general authentication flow is:
```text
Register
   │
   ▼
Create Account
   │
   ▼
Email Verification
   │
   ▼
Login
   │
   ▼
Authenticated User
   │
   ▼
Access Protected Features
```
Authentication uses JWTs, while passwords are securely hashed before being stored.
Email verification and password recovery use temporary tokens delivered through the configured email service.

---

# 🎮 Gamification
Gamification is a central part of EcoLearn.
A simplified progression model looks like:
```text
          Complete Quiz
                │
                ▼
        Complete Challenge
                │
                ▼
           Earn Points
                │
                ▼
          Increase Level
                │
                ▼
         Unlock Achievements
                │
                ▼
        Improve Leaderboard Rank
```
This allows educational activity to directly contribute to a user's progress within the platform.

---

# 🗄️ Main Data Models
The backend uses MongoDB with Mongoose.
Some of the primary models include:
* **User** — user accounts and profile information
* **Quiz** — environmental quizzes and questions
* **QuizResult** — quiz attempts and performance
* **Challenge** — environmental activities
* **Submission** — challenge submissions and verification
* **Badge** — user achievements
* **EcoPoint** — point-related data
---

# 🚀 Getting Started
## Prerequisites
Before running EcoLearn locally, make sure you have:
* Node.js
* npm
* MongoDB or MongoDB Atlas
* An email provider for transactional emails
* Optional media-storage credentials if required by the deployment
---

## Clone the Repository
```bash
git clone https://github.com/cyber-scribe/ecoLearn.git

cd ecoLearn
```
---
## Install Backend Dependencies
```bash
cd server
npm install
```
---

## Install Frontend Dependencies
```bash
cd ../client
npm install
```
---

# ⚙️ Environment Variables
The backend requires environment variables for services such as:
* MongoDB
* JWT authentication
* Application URL
* Email delivery
* Optional media storage
Create a `.env` file inside the `server` directory.

Example structure:
```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

APP_URL=http://localhost:3000

# Email provider configuration
EMAIL_HOST=your_smtp_host
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email_username
EMAIL_PASS=your_email_password

# Optional media storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
> Environment variable names may vary depending on the email or external service configuration used by your deployment.

---

# ▶️ Running Locally

## Start the Backend
```bash
cd server
npm run dev
```
The backend will start in development mode.

## Start the Frontend
Open another terminal:
```bash
cd client
npm start
```

The React development server will start separately.
The application will then consist of:
```text
Frontend
http://localhost:3000
Backend
http://localhost:5000
```
---

# 📧 Email Service
EcoLearn requires an email delivery mechanism for functionality such as:
* Account verification
* Password recovery
* Welcome messages
* System notifications
The application keeps email delivery behind a dedicated service layer rather than coupling authentication directly to a specific provider.
This means the email provider can be changed without restructuring the entire authentication system.
If you fork the project, configure your own email provider credentials in your environment.

---

# 🔒 Security
EcoLearn includes several security mechanisms, including:
* Password hashing
* JWT authentication
* Protected API routes
* Temporary verification tokens
* Temporary password-reset tokens
* Environment-based secret management
* File upload restrictions
* Request validation
Production deployments should additionally use appropriate rate limiting, HTTPS, secure secret management, monitoring and logging.

---

# 🔮 Future Improvements
Potential future improvements include:
* More environmental learning content
* Expanded quiz categories
* More challenge types
* Advanced achievement systems
* Improved leaderboard functionality
* Admin dashboard
* Better analytics
* Notification preferences
* Automated testing
* API documentation
* Improved media storage
* More robust email delivery and monitoring
* CI/CD integration

---

# 🤝 Contributing
Contributions are welcome.
To contribute:
```bash
# Fork the repository
# Clone your fork
git clone <your-fork-url>
# Create a feature branch
git checkout -b feature/my-feature
# Make your changes
# Test the application
# Commit your changes
git commit -m "Add my feature"
# Push the branch
git push origin feature/my-feature
```
Then open a Pull Request.

---

# 🌱 Project Goal
EcoLearn aims to make environmental education more engaging by connecting **knowledge, action, and gamification**.
Instead of simply reading about environmental issues, users can learn, participate, earn rewards, track their progress, and contribute to a more environmentally conscious community.
