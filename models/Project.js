const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  courseSlug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{
    id: { type: String, required: true },
    description: { type: String, required: true },
    selector: { type: String, default: '' },
    containsText: { type: String, default: '' },
    attribute: { type: String, default: '' },
    attributeValue: { type: String, default: '' },
    regexMatch: { type: String, default: '' }
  }],
  templateCode: { type: String, default: '' },
  rewardXp: { type: Number, default: 500 },
  rewardCoins: { type: Number, default: 100 },
  rewardGems: { type: Number, default: 10 }
});

module.exports = mongoose.model('Project', ProjectSchema);
