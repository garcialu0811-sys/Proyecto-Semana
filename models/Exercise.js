const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  courseSlug: { type: String, required: true },
  lessonNumber: { type: Number, required: true },
  exerciseNumber: { type: Number, required: true },
  title: { type: String, required: true },
  instructions: { type: String, required: true },
  initialCode: { type: String, default: '' },
  validationRules: [{
    selector: { type: String, default: '' }, // e.g. 'h1', 'p' (for HTML)
    containsText: { type: String, default: '' },
    attribute: { type: String, default: '' },
    attributeValue: { type: String, default: '' },
    regexMatch: { type: String, default: '' }, // custom backend/frontend evaluation regex
    errorMsg: { type: String, required: true }
  }],
  rewardXp: { type: Number, default: 100 },
  rewardCoins: { type: Number, default: 15 }
});

ExerciseSchema.index({ courseSlug: 1, lessonNumber: 1, exerciseNumber: 1 }, { unique: true });

module.exports = mongoose.model('Exercise', ExerciseSchema);
