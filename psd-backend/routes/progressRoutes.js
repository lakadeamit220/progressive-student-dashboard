import express from 'express';
import ProgressEvent from '../models/ProgressEvent.js';
import Course from '../models/Course.js';
import { protect } from '../middleware/authMiddleware.js';

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
    // For simplicity, we format the actual events into a simple date array
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

    res.json({
      totalTimeSpent,
      completedLessons,
      trendData,
      distributionData,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching dashboard data' });
  }
});

export default router;
