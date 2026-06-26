const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true }, // name of block or icon image file
  banner: { type: String, required: true }, // banner image url or class
  color: { type: String, default: '#22c55e' }, // accent hex color
  difficulty: { type: String, default: 'Principiante' },
  order: { type: Number, default: 0 }
});

module.exports = mongoose.model('Course', CourseSchema);
