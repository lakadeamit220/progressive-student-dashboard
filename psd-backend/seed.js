import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/User.js';
import Course from './models/Course.js';
import Lesson from './models/Lesson.js';
import ProgressEvent from './models/ProgressEvent.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await ProgressEvent.deleteMany({});

    console.log('Creating users...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
      { name: 'Aditya Deshmukh', email: 'aditya@gmail.com', passwordHash, role: 'student' },
      { name: 'Sneha Kulkarni', email: 'sneha@gmail.com', passwordHash, role: 'student' },
      { name: 'Rohan Patil', email: 'rohan@gmail.com', passwordHash, role: 'student' },
      { name: 'Priya Joshi', email: 'priya@gmail.com', passwordHash, role: 'student' },
      { name: 'Sanjay Pawar', email: 'mentor@gmail.com', passwordHash, role: 'mentor' },
      { name: 'Mentor Admin', email: 'mentoradmin@gmail.com', passwordHash, role: 'mentor' },
    ]);

    console.log('Creating courses...');
    const courses = await Course.insertMany([
      { title: 'Full Stack Web Development', description: 'Learn MERN stack from scratch.', totalLessons: 5 },
      { title: 'Advanced React Patterns', description: 'Master React state and performance.', totalLessons: 4 },
      { title: 'Data Structures & Algorithms', description: 'Ace your coding interviews.', totalLessons: 3 },
    ]);

    console.log('Creating lessons...');
    const lessonsData = [
      // Course 1: Full Stack
      { courseId: courses[0]._id, title: 'HTML & CSS Basics', orderIndex: 1 },
      { courseId: courses[0]._id, title: 'JavaScript Fundamentals', orderIndex: 2 },
      { courseId: courses[0]._id, title: 'React Introduction', orderIndex: 3 },
      { courseId: courses[0]._id, title: 'Node & Express API', orderIndex: 4 },
      { courseId: courses[0]._id, title: 'MongoDB & Mongoose', orderIndex: 5 },
      
      // Course 2: React
      { courseId: courses[1]._id, title: 'Hooks Deep Dive', orderIndex: 1 },
      { courseId: courses[1]._id, title: 'Context API & Zustand', orderIndex: 2 },
      { courseId: courses[1]._id, title: 'Performance Optimization', orderIndex: 3 },
      { courseId: courses[1]._id, title: 'Custom Hooks', orderIndex: 4 },

      // Course 3: DSA
      { courseId: courses[2]._id, title: 'Arrays & Strings', orderIndex: 1 },
      { courseId: courses[2]._id, title: 'Linked Lists', orderIndex: 2 },
      { courseId: courses[2]._id, title: 'Trees & Graphs', orderIndex: 3 },
    ];
    const lessons = await Lesson.insertMany(lessonsData);

    console.log('Creating progress events for Aditya...');
    const studentId = users[0]._id; // Aditya Deshmukh
    
    // Aditya completed first 3 lessons of Full Stack
    const fullStackLessons = lessons.filter(l => l.courseId.toString() === courses[0]._id.toString());
    await ProgressEvent.insertMany([
      { userId: studentId, courseId: courses[0]._id, lessonId: fullStackLessons[0]._id, timeSpent: 45, status: 'completed' },
      { userId: studentId, courseId: courses[0]._id, lessonId: fullStackLessons[1]._id, timeSpent: 60, status: 'completed' },
      { userId: studentId, courseId: courses[0]._id, lessonId: fullStackLessons[2]._id, timeSpent: 30, status: 'in-progress' },
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
