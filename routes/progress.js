const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Progress = require('../models/Progress');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Exercise = require('../models/Exercise');
const Quiz = require('../models/Quiz');
const Project = require('../models/Project');
const Achievement = require('../models/Achievement');
const Mission = require('../models/Mission');

// Helper to add rewards and level up
async function addRewards(userId, xpToAdd, coinsToAdd, gemsToAdd = 0) {
  const user = await User.findById(userId);
  if (!user) return null;

  user.xp += xpToAdd;
  user.coins += coinsToAdd;
  user.gems += gemsToAdd;

  // Level up logic (each level needs level * 500 XP)
  let levelUp = false;
  while (user.xp >= user.level * 500) {
    user.xp -= user.level * 500;
    user.level += 1;
    user.coins += 100; // Level up reward
    user.gems += 5;
    levelUp = true;
  }

  // Check achievements
  try {
    const achievements = await Achievement.find();
    const userAchievementIds = user.achievements.map(a => a.achievementId.toString());

    for (const ach of achievements) {
      if (userAchievementIds.includes(ach._id.toString())) continue;

      let unlocked = false;
      if (ach.conditionType === 'level' && user.level >= ach.conditionValue) unlocked = true;
      if (ach.conditionType === 'coins' && user.coins >= ach.conditionValue) unlocked = true;
      
      if (unlocked) {
        user.achievements.push({ achievementId: ach._id });
        user.xp += ach.xpReward;
        user.gems += ach.gemReward;
      }
    }
  } catch (err) {
    console.error('Error al verificar logros:', err);
  }

  await user.save();
  return { level: user.level, xp: user.xp, coins: user.coins, gems: user.gems, levelUp };
}

// Helper to track mission progression
async function updateMissionProgress(userId, targetType, increment = 1) {
  // Can implement missions in a user-mission tracker, or dynamic checking.
  // For simplicity, we can log to server console, but let's see if we want a separate collection.
  // In our models, we have a Mission model. We can query active missions of type and update users
  // but to keep it simple, missions can be checked client-side or we can update mission counters.
  // Let's assume daily/weekly missions are completed and claimed via missions route.
}

// @route   POST api/progress/:slug/lesson/:num
// @desc    Complete a lesson
// @access  Private
router.post('/:slug/lesson/:num', auth, async (req, res) => {
  try {
    const { slug, num } = req.params;
    const lessonNum = parseInt(num);

    const lesson = await Lesson.findOne({ courseSlug: slug, lessonNumber: lessonNum });
    if (!lesson) {
      return res.status(404).json({ msg: 'Lección no encontrada' });
    }

    let progress = await Progress.findOne({ userId: req.user.id, courseSlug: slug });
    if (!progress) {
      progress = new Progress({ userId: req.user.id, courseSlug: slug });
    }

    let isNewCompletion = false;
    if (!progress.lessonsCompleted.includes(lessonNum)) {
      progress.lessonsCompleted.push(lessonNum);
      isNewCompletion = true;
    }

    await progress.save();

    let rewards = null;
    if (isNewCompletion) {
      rewards = await addRewards(req.user.id, lesson.rewardXp, 10);
    }

    res.json({
      progress,
      rewards,
      msg: isNewCompletion ? 'Lección completada' : 'Lección ya completada anteriormente'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

// @route   POST api/progress/:slug/exercise/:num
// @desc    Complete an exercise
// @access  Private
router.post('/:slug/exercise/:num', auth, async (req, res) => {
  try {
    const { slug, num } = req.params;
    const exerciseNum = parseInt(num);

    const exercise = await Exercise.findOne({ courseSlug: slug, exerciseNumber: exerciseNum });
    if (!exercise) {
      return res.status(404).json({ msg: 'Ejercicio no encontrado' });
    }

    let progress = await Progress.findOne({ userId: req.user.id, courseSlug: slug });
    if (!progress) {
      progress = new Progress({ userId: req.user.id, courseSlug: slug });
    }

    let isNewCompletion = false;
    if (!progress.exercisesCompleted.includes(exerciseNum)) {
      progress.exercisesCompleted.push(exerciseNum);
      isNewCompletion = true;
    }

    await progress.save();

    let rewards = null;
    if (isNewCompletion) {
      rewards = await addRewards(req.user.id, exercise.rewardXp, exercise.rewardCoins);
    }

    res.json({
      progress,
      rewards,
      msg: isNewCompletion ? 'Ejercicio verificado con éxito' : 'Ejercicio ya verificado anteriormente'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

// @route   POST api/progress/:slug/quiz/:num
// @desc    Complete a quiz
// @access  Private
router.post('/:slug/quiz/:num', auth, async (req, res) => {
  try {
    const { slug, num } = req.params;
    const quizNum = parseInt(num);

    const quiz = await Quiz.findOne({ courseSlug: slug, quizNumber: quizNum });
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz no encontrado' });
    }

    let progress = await Progress.findOne({ userId: req.user.id, courseSlug: slug });
    if (!progress) {
      progress = new Progress({ userId: req.user.id, courseSlug: slug });
    }

    let isNewCompletion = false;
    if (!progress.quizzesCompleted.includes(quizNum)) {
      progress.quizzesCompleted.push(quizNum);
      isNewCompletion = true;
    }

    await progress.save();

    let rewards = null;
    if (isNewCompletion) {
      rewards = await addRewards(req.user.id, quiz.rewardXp, quiz.rewardCoins);
    }

    res.json({
      progress,
      rewards,
      msg: isNewCompletion ? 'Quiz aprobado' : 'Quiz ya aprobado anteriormente'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

// @route   POST api/progress/:slug/project
// @desc    Submit final project code
// @access  Private
router.post('/:slug/project', auth, async (req, res) => {
  try {
    const { slug } = req.params;
    const { code, score } = req.body; // Score from client-side evaluation (0 to 100)

    const project = await Project.findOne({ courseSlug: slug });
    if (!project) {
      return res.status(404).json({ msg: 'Proyecto final no encontrado' });
    }

    let progress = await Progress.findOne({ userId: req.user.id, courseSlug: slug });
    if (!progress) {
      progress = new Progress({ userId: req.user.id, courseSlug: slug });
    }

    let isNewCompletion = !progress.projectSubmitted;
    progress.projectSubmitted = true;
    progress.projectScore = score || 100;
    progress.projectCode = code;
    
    await progress.save();

    let rewards = null;
    if (isNewCompletion) {
      rewards = await addRewards(
        req.user.id,
        project.rewardXp,
        project.rewardCoins,
        project.rewardGems
      );
    }

    res.json({
      progress,
      rewards,
      msg: isNewCompletion ? 'Proyecto enviado con éxito' : 'Proyecto actualizado'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
module.exports.addRewards = addRewards;
