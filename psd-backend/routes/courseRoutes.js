import express from 'express';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching courses' });
  }
});

// @route   GET /api/courses/:courseId/lessons
// @desc    Get all lessons for a specific course
// @access  Private
router.get('/:courseId/lessons', protect, async (req, res) => {
  try {
    const lessons = await Lesson.find({ courseId: req.params.courseId }).sort('orderIndex');
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching lessons' });
  }
});

export default router;
