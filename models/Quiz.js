const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  courseSlug: { type: String, required: true },
  lessonNumber: { type: Number, required: true },
  quizNumber: { type: Number, required: true },
  title: { type: String, required: true },
  questions: [{
    questionText: { type: String, required: true },
    type: { type: String, enum: ['multiple', 'boolean', 'code'], default: 'multiple' },
    options: [{ type: String }], // list of choices
    correctAnswer: { type: String, required: true }, // exact string value or option index
    explanation: { type: String, default: '' }
  }],
  rewardXp: { type: Number, default: 150 },
  rewardCoins: { type: Number, default: 20 }
});

QuizSchema.index({ courseSlug: 1, lessonNumber: 1, quizNumber: 1 }, { unique: true });

module.exports = mongoose.model('Quiz', QuizSchema);
