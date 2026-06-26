const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true }, // e.g. 'diamond_sword', 'golden_apple'
  conditionType: { type: String, enum: ['level', 'xp', 'lessons', 'projects', 'coins'], required: true },
  conditionValue: { type: Number, required: true },
  xpReward: { type: Number, default: 200 },
  gemReward: { type: Number, default: 5 }
});

module.exports = mongoose.model('Achievement', AchievementSchema);
