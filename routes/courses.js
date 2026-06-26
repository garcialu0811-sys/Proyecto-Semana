const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Exercise = require('../models/Exercise');
const Quiz = require('../models/Quiz');
const Project = require('../models/Project');
const Progress = require('../models/Progress');

// @route   GET api/courses
// @desc    Get all courses with optional user progress
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const courses = await Course.find().sort({ order: 1 });
    const progress = await Progress.find({ userId: req.user.id });

    // Combine courses with their progress
    const coursesWithProgress = courses.map(course => {
      const courseProg = progress.find(p => p.courseSlug === course.slug);
      return {
        ...course.toObject(),
        progress: courseProg ? {
          lessonsCompleted: courseProg.lessonsCompleted,
          exercisesCompleted: courseProg.exercisesCompleted,
          quizzesCompleted: courseProg.quizzesCompleted,
          projectSubmitted: courseProg.projectSubmitted,
          projectScore: courseProg.projectScore
        } : {
          lessonsCompleted: [],
          exercisesCompleted: [],
          quizzesCompleted: [],
          projectSubmitted: false,
          projectScore: 0
        }
      };
    });

    res.json(coursesWithProgress);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

// @route   GET api/courses/:slug
// @desc    Get single course details (lessons, exercises, quizzes, project, progress)
// @access  Private
router.get('/:slug', auth, async (req, res) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug });
    if (!course) {
      return res.status(404).json({ msg: 'Curso no encontrado' });
    }

    const lessons = await Lesson.find({ courseSlug: slug }).sort({ lessonNumber: 1 });
    const exercises = await Exercise.find({ courseSlug: slug }).sort({ lessonNumber: 1, exerciseNumber: 1 });
    const quizzes = await Quiz.find({ courseSlug: slug }).sort({ lessonNumber: 1, quizNumber: 1 });
    const project = await Project.findOne({ courseSlug: slug });
    
    let progress = await Progress.findOne({ userId: req.user.id, courseSlug: slug });
    if (!progress) {
      progress = new Progress({
        userId: req.user.id,
        courseSlug: slug,
        lessonsCompleted: [],
        exercisesCompleted: [],
        quizzesCompleted: [],
        projectSubmitted: false,
        projectScore: 0
      });
      await progress.save();
    }

    res.json({
      course,
      lessons,
      exercises,
      quizzes,
      project,
      progress
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
