const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseSlug: { type: String, required: true },
  lessonsCompleted: [{ type: Number }], // Array of lesson numbers completed
  exercisesCompleted: [{ type: Number }], // Array of exercise numbers completed (e.g. 1, 2, 3...)
  quizzesCompleted: [{ type: Number }], // Array of quiz numbers completed
  projectSubmitted: { type: Boolean, default: false },
  projectScore: { type: Number, default: 0 },
  projectCode: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

ProgressSchema.index({ userId: 1, courseSlug: 1 }, { unique: true });

module.exports = mongoose.model('Progress', ProgressSchema);
