const mongoose = require('mongoose');

const MissionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['daily', 'weekly', 'course'], required: true },
  targetType: { type: String, enum: ['lessons', 'exercises', 'quizzes', 'projects', 'login'], required: true },
  targetValue: { type: Number, required: true },
  xpReward: { type: Number, default: 100 },
  coinReward: { type: Number, default: 50 },
  gemReward: { type: Number, default: 0 }
});

module.exports = mongoose.model('Mission', MissionSchema);
