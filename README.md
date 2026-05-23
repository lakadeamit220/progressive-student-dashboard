# Progressive Student Dashboard

Welcome to the Progressive Student Dashboard. This project demonstrates a complete full-stack application built to track student progress, recommend next steps, and visualize learning insights.

## Project Overview

The application features a dynamic, responsive user interface backed by a robust REST API and a relational database.

- **Student Dashboard**: Shows completed lessons, time spent, and progress per course.
- **Visualizations**: Interactive trend charts and distribution charts to visualize learning insights.
- **Authentication**: Custom JWT-based authentication for students and mentors.

## Tech Stack

This project was built using modern, scalable technologies:

**Frontend**
- **React.js (Vite)**: For building the dynamic user interface.
- **Tailwind CSS v4**: For responsive styling, grid layouts, and smooth animations.
- **Zustand**: For global state management.
- **Axios**: For handling API requests.
- **Recharts**: For time-series and distribution visualizations.

**Backend**
- **Node.js & Express.js**: For building the RESTful API using ES Modules.
- **MongoDB**: As the primary database.
- **Mongoose**: For database modeling and validation.

---

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Running locally)

---

## Installation & Setup Guide

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone https://github.com/lakadeamit220/progressive-student-dashboard.git
cd progressive-student-dashboard
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd psd-backend
npm install
```

**Configure the Database:**
1. Ensure your local MongoDB instance is running (usually at `mongodb://127.0.0.1:27017`).
2. Create a new `.env` file in the `psd-backend` folder and add your connection string and JWT secret:
```env
PORT=5000
MONGODB_URI="mongodb://127.0.0.1:27017/progressive_student_dashboard"
JWT_SECRET="your_super_secret_jwt_key_here"
```

**Initialize the Database:**
Run the seed script to populate the database with mockup data:
```bash
node seed.js
```

**Start the Backend Server:**
```bash
npm run dev
```
*The backend will now be running at `http://localhost:5000`.*

---

### 3. Frontend Setup
Open a **new terminal window**, navigate to the frontend directory, and install dependencies:
```bash
cd psd-frontend
npm install
```

**Start the Frontend Server:**
```bash
npm run dev
```
*The frontend will now be running at `http://localhost:5173`.*

---

## Database Relationships

To understand how the data flows between collections, here is our core structure:

### 1. User
| id | name | email | passwordHash | role |
| :--- | :--- | :--- | :--- | :--- |
| `ObjectId` | John Doe | john@example.com | `$2b$...` | student |

### 2. Course
| id | title | description | totalLessons |
| :--- | :--- | :--- | :--- |
| `ObjectId` | React Fundamentals | Learn React from scratch | 10 |

### 3. Lesson (One-to-Many with Course)
| id | courseId | title | orderIndex |
| :--- | :--- | :--- | :--- |
| `ObjectId` | `Course_ObjectId` | Components | 1 |

### 4. ProgressEvent
Tracks a user's progress on specific lessons.
| id | userId | courseId | lessonId | timeSpent | status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ObjectId` | `User_ObjectId` | `Course_ObjectId` | `Lesson_ObjectId` | 45 | completed |

---

## Development Roadmap
Here is the step-by-step roadmap followed to build this application:

### Phase 1: Environment Setup
- Initialized Node.js backend & React + Vite frontend.
- Installed and configured Tailwind CSS v4 and Zustand.
- Cleaned up root directory and added `.gitignore`.

### Phase 2: Database Setup
- Configured local MongoDB connection.
- Created Mongoose schemas for User, Course, Lesson, and ProgressEvent.

### Phase 3: Express Backend APIs (CRUD & Auth)
- Built main Express entry point with CORS and JSON parsing.
- Implemented JWT authentication (login/register).
- Created endpoints for dashboard aggregations and event logging.
- Created `seed.js` script to populate database.

### Phase 4: Frontend State & API Integration
- Configured Axios for API requests.
- Set up Zustand store for authentication and data state.

### Phase 5: Dashboard Implementation
- Built student dashboard with summary metrics.
- Integrated Recharts for dynamic time-series and distribution visualizations.
