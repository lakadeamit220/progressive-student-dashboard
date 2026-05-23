import express from 'express';
import ProgressEvent from '../models/ProgressEvent.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import User from '../models/User.js';
import { protect, mentor } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/progress/event
// @desc    Log a progress event (time spent, completion status)
// @access  Private
router.post('/event', protect, async (req, res) => {
  try {
    const { courseId, lessonId, timeSpent, status } = req.body;

    const progressEvent = await ProgressEvent.create({
      userId: req.user._id,
      courseId,
      lessonId,
      timeSpent,
      status,
    });

    res.status(201).json(progressEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server error logging progress' });
  }
});

// @route   GET /api/progress/dashboard
// @desc    Get aggregated dashboard data for the logged-in user
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all events for the user
    const events = await ProgressEvent.find({ userId });

    // Aggregate metrics
    const totalTimeSpent = events.reduce((acc, event) => acc + event.timeSpent, 0);
    const completedLessons = events.filter((e) => e.status === 'completed').length;

    // Time-series data for Recharts (last 7 days dummy or actual)
    const trendDataMap = {};
    events.forEach(event => {
      const date = event.createdAt.toISOString().split('T')[0];
      trendDataMap[date] = (trendDataMap[date] || 0) + event.timeSpent;
    });

    const trendData = Object.keys(trendDataMap).map(date => ({
      date,
      timeSpent: trendDataMap[date]
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Distribution data: progress per course
    const courseProgressMap = {};
    for (const event of events) {
      if (event.status === 'completed') {
        courseProgressMap[event.courseId] = (courseProgressMap[event.courseId] || 0) + 1;
      }
    }

    const courses = await Course.find({ _id: { $in: Object.keys(courseProgressMap) } });
    
    const distributionData = courses.map(course => ({
      name: course.title,
      completedLessons: courseProgressMap[course._id] || 0,
      totalLessons: course.totalLessons,
    }));

    // Calculate recommended next lesson
    let recommendedLesson = null;
    if (events.length > 0) {
      // Find the most recently interacted course
      const sortedEvents = [...events].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const lastActiveCourseId = sortedEvents[0].courseId;

      // Get all lessons for this course, sorted
      const courseLessons = await Lesson.find({ courseId: lastActiveCourseId }).sort('orderIndex');
      
      // Get all completed lesson IDs for this course by this user
      const completedIds = events
        .filter(e => e.courseId.toString() === lastActiveCourseId.toString() && e.status === 'completed')
        .map(e => e.lessonId.toString());

      // Find the first lesson that isn't completed
      const nextLesson = courseLessons.find(l => !completedIds.includes(l._id.toString()));
      
      if (nextLesson) {
        const courseInfo = await Course.findById(lastActiveCourseId);
        if (courseInfo) {
          recommendedLesson = {
            courseId: courseInfo._id,
            courseTitle: courseInfo.title,
            lessonId: nextLesson._id,
            lessonTitle: nextLesson.title
          };
        }
      }
    }

    res.json({
      totalTimeSpent,
      completedLessons,
      trendData,
      distributionData,
      recommendedLesson,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching dashboard data' });
  }
});

// @route   GET /api/progress/mentor
// @desc    Get all students progress for mentor dashboard
// @access  Private/Mentor
router.get('/mentor', protect, mentor, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-passwordHash');
    
    const studentData = await Promise.all(students.map(async (student) => {
      const events = await ProgressEvent.find({ userId: student._id });
      const totalTimeSpent = events.reduce((acc, event) => acc + event.timeSpent, 0);
      const completedLessons = events.filter((e) => e.status === 'completed').length;
      
      return {
        _id: student._id,
        name: student.name,
        email: student.email,
        totalTimeSpent,
        completedLessons,
        lastActive: events.length > 0 ? events[events.length - 1].createdAt : student.createdAt
      };
    }));

    res.json(studentData);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching mentor data' });
  }
});

export default router;
