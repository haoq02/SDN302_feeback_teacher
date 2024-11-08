const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Course', courseSchema);
