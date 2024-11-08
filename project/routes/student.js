
const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const Course = require('../models/Course');


router.post('/feedback', async (req, res) => {
    const { courseId, studentId, rating, criteria, comment } = req.body;

    try {
        // Tìm course và lấy teacherId từ đó
        const course = await Course.findById(courseId).populate('teacher');
        if (!course || !course.teacher) {
            return res.status(400).json({ message: 'Không tìm thấy giáo viên cho lớp học này' });
        }

        // Kiểm tra xem sinh viên đã gửi feedback cho khóa học này chưa
        const existingFeedback = await Feedback.findOne({ course: courseId, student: studentId });
        if (existingFeedback) {
            return res.status(400).json({ message: 'Bạn đã gửi feedback cho lớp học này' });
        }

        // Tạo feedback mới với teacher lấy từ course
        const feedback = new Feedback({
            course: courseId,
            teacher: course.teacher._id, // Lấy teacherId từ course
            student: studentId,
            rating,
            criteria,
            comment
        });
        await feedback.save();

        const populatedFeedback = await Feedback.findById(feedback._id)
            .populate({ path: 'student', select: 'name' })
            .populate({ path: 'course', select: 'name' })
            .populate({ path: 'teacher', select: 'name' });

        res.status(201).json({ message: 'Feedback đã được gửi thành công', feedback: populatedFeedback });
    } catch (error) {
        console.error("Error saving feedback:", error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi gửi feedback', error });
    }
});


// Endpoint lấy feedback của sinh viên
router.get('/feedbacks/:studentId', async (req, res) => {
    const { studentId } = req.params;

    try {
        const feedbacks = await Feedback.find({ student: studentId })
        .populate({ path: 'student', select: 'name' }) // Lấy tên sinh viên

            .populate({ path: 'course', select: 'name' })
            .populate({ path: 'teacher', select: 'name' });

        res.status(200).json({ feedbacks });
    } catch (error) {
        console.error("Error fetching student feedbacks:", error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi tải feedbacks', error });
    }
});

// Endpoint để lấy danh sách các khóa học của sinh viên, bao gồm teacher
router.get('/courses/:studentId', async (req, res) => {
    const { studentId } = req.params;

    try {
        const courses = await Course.find({ students: studentId })
            .select('name teacher')
            .populate('teacher', 'name');

        res.status(200).json({ courses });
    } catch (error) {
        console.error("Error fetching student courses:", error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh sách lớp học', error });
    }
});

// Endpoint cập nhật feedback của sinh viên
router.put('/feedback/:feedbackId', async (req, res) => {
    const { feedbackId } = req.params;
    const { rating, criteria, comment } = req.body;

    try {
        // Tìm feedback theo ID
        const feedback = await Feedback.findById(feedbackId);
        
        // Kiểm tra nếu feedback không tồn tại
        if (!feedback) {
            return res.status(404).json({ message: 'Không tìm thấy feedback' });
        }

        // Cập nhật các trường của feedback
        feedback.rating = rating !== undefined ? rating : feedback.rating;
        feedback.criteria = criteria !== undefined ? criteria : feedback.criteria;
        feedback.comment = comment !== undefined ? comment : feedback.comment;
        
        // Lưu lại feedback đã cập nhật
        await feedback.save();

        const populatedFeedback = await Feedback.findById(feedbackId)
            .populate({ path: 'student', select: 'name' })
            .populate({ path: 'course', select: 'name' })
            .populate({ path: 'teacher', select: 'name' });

        res.status(200).json({ message: 'Feedback đã được cập nhật thành công', feedback: populatedFeedback });
    } catch (error) {
        console.error("Error updating feedback:", error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật feedback', error });
    }
});

module.exports = router;
