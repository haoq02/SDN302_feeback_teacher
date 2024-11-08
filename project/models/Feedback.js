const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    criteria: {
        clarity: { type: Number, min: 1, max: 5 },
        engagement: { type: Number, min: 1, max: 5 },
        knowledge: { type: Number, min: 1, max: 5 },
        approachability: { type: Number, min: 1, max: 5 }
    },
    comment: { type: String },
    response: { type: String }, // Thêm trường response cho phản hồi từ giáo viên
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);


