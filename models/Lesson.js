const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  courseSlug: { type: String, required: true },
  lessonNumber: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  content: { type: String, required: true }, // HTML format or plain text explanation
  conceptToLearn: { type: String, default: '' },
  exampleCode: { type: String, default: '' },
  tip: { type: String, default: '' },
  imageKey: { type: String, default: 'book' }, // image name/theme, e.g. 'steve_reading', 'enchanting_table'
  rewardXp: { type: Number, default: 50 }
});

// Compound index to ensure uniqueness per course
LessonSchema.index({ courseSlug: 1, lessonNumber: 1 }, { unique: true });

module.exports = mongoose.model('Lesson', LessonSchema);
