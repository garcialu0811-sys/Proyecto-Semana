const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'steve' }, // 'steve', 'alex', 'creeper', 'zombie', 'wolf'
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  coins: { type: Number, default: 0 },
  gems: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastLoginDate: { type: String, default: '' }, // YYYY-MM-DD
  inventory: [{
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem' },
    quantity: { type: Number, default: 1 },
    equipped: { type: Boolean, default: false }
  }],
  achievements: [{
    achievementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' },
    unlockedAt: { type: Date, default: Date.now }
  }],
  activePet: { type: String, default: '' }, // 'wolf', 'cat', 'slime', 'parrot', 'creeper'
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
