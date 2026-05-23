# Progressive Student Dashboard - API Documentation

Base URL: `http://localhost:5000/api`

All routes marked as **Protected** require a valid JWT token in the `Authorization` header formatted as:
`Authorization: Bearer <token>`

---

## 1. Authentication (`/api/auth`)

### `POST /auth/register`
Register a new student account.
- **Access:** Public
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response (201):**
  ```json
  {
    "_id": "60d5ecb8b392d7...123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "token": "eyJhbGciOiJIUzI1..."
  }
  ```

### `POST /auth/login`
Authenticate an existing user (Student or Mentor).
- **Access:** Public
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response (200):** Same as Register.

### `GET /auth/me`
Retrieve the logged-in user's profile.
- **Access:** Protected
- **Response (200):** User object without token.

---

## 2. Courses (`/api/courses`)

### `GET /courses`
Retrieve a list of all available courses.
- **Access:** Protected
- **Response (200):** Array of Course objects.

### `GET /courses/:courseId/lessons`
Retrieve all lessons for a specific course, sorted by `orderIndex`.
- **Access:** Protected
- **Response (200):** Array of Lesson objects.

---

## 3. Progress & Analytics (`/api/progress`)

### `POST /progress/event`
Log a learning event (e.g., marking a lesson complete).
- **Access:** Protected
- **Body:**
  ```json
  {
    "courseId": "60d5ec...",
    "lessonId": "60d5ec...",
    "timeSpent": 15,
    "status": "completed"
  }
  ```
- **Response (201):** The created ProgressEvent object.

### `GET /progress/course/:courseId/completed`
Retrieve all lesson IDs that the logged-in user has completed for a specific course.
- **Access:** Protected
- **Response (200):** Array of string IDs.
  ```json
  [
    "664eebe6d2a13f...",
    "664eebe6d2a13f..."
  ]
  ```

### `GET /progress/dashboard`
Get all algorithmic aggregates, trend data, and active mentor recommendations for the student dashboard.
- **Access:** Protected
- **Response (200):**
  ```json
  {
    "totalTimeSpent": 120,
    "completedLessons": 8,
    "trendData": [{ "date": "2024-05-20", "timeSpent": 45 }],
    "distributionData": [{ "name": "React Basics", "completedLessons": 4, "totalLessons": 10 }],
    "recommendedLesson": { "courseId": "...", "lessonId": "...", "courseTitle": "...", "lessonTitle": "..." },
    "mentorRecommendation": { "courseId": "...", "courseTitle": "...", "message": "..." }
  }
  ```

---

## 4. Mentor Operations (`/api/progress`)

### `GET /progress/mentor`
Retrieve aggregated progress data for all registered students.
- **Access:** Protected (Requires `mentor` role)
- **Response (200):**
  ```json
  [
    {
      "_id": "60d5ec...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "totalTimeSpent": 340,
      "completedLessons": 12,
      "lastActive": "2024-05-21T10:30:00Z"
    }
  ]
  ```

### `POST /progress/recommend`
Send a personalized course recommendation to a specific student.
- **Access:** Protected (Requires `mentor` role)
- **Body:**
  ```json
  {
    "studentId": "60d5ec...",
    "courseId": "60d5ec...",
    "message": "I noticed you struggling with X, this course might help!"
  }
  ```
- **Response (201):** The created Recommendation document.
