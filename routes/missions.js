const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Mission = require('../models/Mission');
const Progress = require('../models/Progress');
const User = require('../models/User');

// Helper to add rewards
const { addRewards } = require('./progress');

// @route   GET api/missions
// @desc    Get active missions with dynamic student progress
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const missions = await Mission.find();
    const progressList = await Progress.find({ userId: req.user.id });
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // Dynamic progress calculation
    let totalLessons = 0;
    let totalExercises = 0;
    let totalQuizzes = 0;
    let totalProjects = 0;

    progressList.forEach(p => {
      totalLessons += p.lessonsCompleted.length;
      totalExercises += p.exercisesCompleted.length;
      totalQuizzes += p.quizzesCompleted.length;
      if (p.projectSubmitted) {
        totalProjects += 1;
      }
    });

    const missionsWithProgress = missions.map(m => {
      let currentVal = 0;
      if (m.targetType === 'lessons') currentVal = totalLessons;
      else if (m.targetType === 'exercises') currentVal = totalExercises;
      else if (m.targetType === 'quizzes') currentVal = totalQuizzes;
      else if (m.targetType === 'projects') currentVal = totalProjects;
      else if (m.targetType === 'login') currentVal = user.streak;

      return {
        ...m.toObject(),
        currentValue: currentVal,
        completed: currentVal >= m.targetValue
      };
    });

    res.json(missionsWithProgress);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
