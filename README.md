# 🚀 Progressive Student Dashboard

A full-stack, comprehensive web application designed to track student progress, visualize learning insights, and provide mentors with actionable data. Built with modern web technologies, this platform delivers a premium, distraction-free learning experience.

![Dashboard Preview](https://via.placeholder.com/1200x600.png?text=Progressive+Student+Dashboard) <!-- Replace with an actual screenshot -->

---

## 📖 Project Overview

The Progressive Student Dashboard bridges the gap between learning and analytics. It provides two distinct portals:
1. **Student Portal**: Where learners can discover courses, consume content, and visualize their daily learning habits.
2. **Mentor Portal**: Where teachers can monitor the progress of their entire classroom, identify struggling students, and track overall engagement.

### ✨ Key Features
- **Role-Based Access Control (RBAC)**: Secure routing and API endpoints that differentiate between `student` and `mentor` roles.
- **Interactive Course Player**: A distraction-free environment to watch lessons, with a "Mark as Complete" system that dynamically updates backend progress metrics.
- **Advanced Data Visualization**: Real-time charts powered by Recharts.
  - **Learning Activity**: A sleek, interactive Line Chart tracking minutes spent learning per day.
  - **Course Distribution**: A Pie/Donut Chart showing how completed lessons are distributed across various courses.
- **Mentor Dashboard**: A data-rich table displaying all enrolled students, their total time spent, completed lessons, and last active date, complete with real-time text search.
- **Profile & Settings Management**: Users can securely update their name, email, and password (utilizing `bcrypt` hashing).
- **Modern UI/UX**: Built with Tailwind CSS, utilizing a soft light theme (Slate/Indigo), glassmorphism effects, responsive grid layouts, and `lucide-react` iconography.

---

## 🛠️ Technology Stack

This project is built using the **MERN** stack, augmented with modern frontend libraries.

**Frontend:**
- **React 18**: Core library for building the user interface.
- **Vite**: Ultra-fast build tool and development server.
- **Tailwind CSS v4**: Utility-first CSS framework for rapid UI development.
- **Zustand**: Lightweight, fast, and scalable state management (handles global authentication state).
- **React Router DOM v6**: Declarative routing for React (including Protected Routes).
- **Recharts**: Composable charting library built on React components.
- **Axios**: Promise-based HTTP client (configured with interceptors for JWT token attachment).
- **React Hot Toast**: Beautiful, animated toast notifications.

**Backend:**
- **Node.js & Express.js**: Fast, unopinionated, minimalist web framework for building the RESTful API.
- **MongoDB**: NoSQL database for flexible data storage.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.
- **JSON Web Tokens (JWT)**: Secure, stateless user authentication.
- **Bcrypt**: Library to help hash passwords for secure database storage.
- **Cors & Dotenv**: Middleware for Cross-Origin Resource Sharing and environment variable management.

---

## 🚦 How to Run Locally

Follow these instructions to get the project running on your local machine. This guide assumes you have no prior setup.

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Running locally on default port `27017`)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/lakadeamit220/progressive-student-dashboard.git
cd progressive-student-dashboard
```

### 2. Backend Setup
Open a terminal and navigate to the backend directory:
```bash
cd psd-backend
npm install
```

Create a `.env` file in the `psd-backend` folder with the following configuration:
```env
PORT=5000
MONGODB_URI="mongodb://127.0.0.1:27017/progressive_student_dashboard"
JWT_SECRET="super_secret_jwt_key_123"
```

### 3. Database Seeding (Crucial Step)
To experience the application fully, populate your local database with dummy users, courses, and progress data:
```bash
node seed.js
```
*You should see output indicating successful seeding of users, courses, and lessons.*

### 4. Start the Backend Server
```bash
npm run dev
```
*The backend will start running at `http://localhost:5000`.*

### 5. Frontend Setup
Open a **new** terminal window and navigate to the frontend directory:
```bash
cd psd-frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
*The frontend will start running at `http://localhost:5173`.*

---

## 🧪 Testing the Application (Test Users)

Open your browser and navigate to `http://localhost:5173`. You will see the beautiful Landing Page. Click **"Sign In"** or **"Start Learning Now"**.

Use the following seeded credentials to explore different sides of the application:

### 🎓 Student Accounts
Students have access to the Dashboard (Charts), Course Catalog, Course Player, and History.

| Name | Email | Password |
| :--- | :--- | :--- |
| Aditya Deshmukh | `aditya@gmail.com` | `password123` |
| Sneha Kulkarni | `sneha@gmail.com` | `password123` |
| Rohan Patil | `rohan@gmail.com` | `password123` |
| Priya Joshi | `priya@gmail.com` | `password123` |

*Note: The `aditya@gmail.com` account comes pre-loaded with extensive progress data so you can see the charts in action immediately!*

### 👨‍🏫 Mentor Accounts
Mentors have access to a specialized "Mentor Dashboard" to monitor the students.

| Name | Email | Password |
| :--- | :--- | :--- |
| Mentor Admin | `mentor@gmail.com` | `password123` |

---

## 🗄️ Database Schema & Architecture

The MongoDB database relies on four primary collections:

1. **Users**: Stores credentials, names, and the `role` enum (`student` or `mentor`).
2. **Courses**: Stores the metadata for a learning track (Title, Description, Total Lessons).
3. **Lessons**: Linked to a Course via `courseId`. Contains the lesson title and sequence order.
4. **ProgressEvents**: The core analytics engine. Every time a student interacts with a lesson, an event is created linking the `userId`, `courseId`, and `lessonId`, along with `timeSpent` and `status` (`in-progress` or `completed`).

### 🔐 Authentication Flow
1. User submits login form.
2. Backend verifies password via `bcrypt.compare()`.
3. Backend issues a JWT signed with `JWT_SECRET`.
4. Frontend receives the JWT and user object, storing them in memory via Zustand.
5. Axios Interceptor intercepts all future outgoing requests and attaches `Authorization: Bearer <token>` to the headers.
6. Backend `protect` middleware verifies the token before granting access to `/api/progress/*` or `/api/courses/*`.
7. Backend `mentor` middleware explicitly blocks any user whose role is not `mentor` from accessing `/api/progress/mentor`.

---

## 🗺️ Project Roadmap & History

This project was built iteratively in distinct phases:

- **Phase 1-3:** Environment setup, MongoDB schema design, and seeding robust dummy data (including 6 distinct courses).
- **Phase 4-5:** Implementation of the Node.js REST API, JWT Authentication, and setting up the Vite React frontend with Zustand state management.
- **Phase 6-7:** Building the core Student Dashboard, integrating `Recharts` for Data Visualization, and designing a light, modern UI.
- **Phase 8:** Implementing Role-Based Access Control, the interactive Course Player, Profile/Settings management, and the comprehensive Mentor Dashboard.

---

## 🟢 Current Status
**Status: Production-Ready MVP**
The application is currently fully functional as a Minimum Viable Product. 
- The backend API is stable, secure, and correctly handles relational database queries.
- Authentication and RBAC middleware successfully intercept unauthorized requests.
- The frontend state management is clean, UI components are responsive, and data visualizations accurately reflect the database.

## 🚀 Possible Future Improvements
While the foundation is strong, the following features could be implemented to scale the application:

1. **Gamification (Streaks & Badges):** 
   - Add a daily streak counter and an achievement system to encourage consistent learning habits.
2. **Certificate Generation:**
   - Automatically generate a downloadable PDF certificate when a student reaches 100% completion in a specific course track.
3. **Mentor Messaging System:**
   - Allow mentors to click on a struggling student from their dashboard and send a direct "nudge" or message that appears as a notification on the student's portal.
4. **Interactive Quizzes:**
   - Require students to pass a multiple-choice assessment at the end of a lesson before it can be marked as "completed".
5. **Course Search & Filtering:**
   - Implement category tags and a search bar on the `/courses` page to handle larger course catalogs.

---

## 🤝 Contributing
Feel free to fork this repository and submit Pull Requests. For major changes, please open an issue first to discuss what you would like to change.
