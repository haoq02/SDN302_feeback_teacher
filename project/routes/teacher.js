const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const Course = require('../models/Course');

// Endpoint để giáo viên xem tất cả feedback của khóa học
router.get('/feedback/:courseId', async (req, res) => {
    const { courseId } = req.params;
    const teacherId = req.session.teacherId; // Lấy teacherId từ session

    // Kiểm tra teacherId tồn tại trong session
    if (!teacherId) {
        return res.status(401).json({ message: 'Vui lòng đăng nhập lại' });
    }

    try {
        // Kiểm tra giáo viên có dạy khóa học này không
        const course = await Course.findOne({ _id: courseId, teacher: teacherId });
        if (!course) {
            return res.status(403).json({ message: 'Giáo viên không có quyền xem feedback của khóa học này' });
        }

        // Lấy tất cả feedback của khóa học và populate course và teacher
        const feedbacks = await Feedback.find({ course: courseId })
            .populate({ path: 'student', select: 'name' })   // Hiển thị tên của sinh viên
            .populate({ path: 'course', select: 'name' })    // Hiển thị tên của khóa học
            .populate({ path: 'teacher', select: 'name' });  // Hiển thị tên của giáo viên

        res.status(200).json({ feedbacks });
    } catch (error) {
        console.error("Error fetching feedback:", error); // Ghi chi tiết lỗi vào console
        res.status(500).json({ message: 'Có lỗi xảy ra', error: error.message });
    }
});


// Endpoint để lấy danh sách các khóa học của giáo viên
router.get('/courses/:teacherId', async (req, res) => {
    const { teacherId } = req.params;

    try {
        const courses = await Course.find({ teacher: teacherId }).select('name');
        res.status(200).json({ courses });
    } catch (error) {
        console.error("Error fetching teacher's courses:", error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh sách lớp học', error });
    }
});




// Lấy feedback cho một lớp học cụ thể dựa trên `courseId`
router.get('/feedback/:courseId', async (req, res) => {
    const { courseId } = req.params;

    try {
        const feedbacks = await Feedback.find({ course: courseId })
            .populate('student', 'name')
            .populate('course', 'name')
            .populate('teacher', 'name');
        res.status(200).json({ feedbacks });
    } catch (error) {
        console.error("Error fetching feedback for course:", error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh sách feedback', error });
    }
});


// Endpoint để giáo viên trả lời feedback
router.put('/feedback/:feedbackId/response', async (req, res) => {
    const { feedbackId } = req.params;
    const { response } = req.body;

    try {
        const feedback = await Feedback.findById(feedbackId);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback không tồn tại' });
        }

        // Cập nhật phản hồi của giáo viên
        feedback.response = response;
        await feedback.save();

        res.status(200).json({ message: 'Phản hồi của giáo viên đã được cập nhật', feedback });
    } catch (error) {
        console.error("Error updating feedback response:", error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật phản hồi', error });
    }
});




// Thêm lớp học mới
router.post('/add-course', async (req, res) => {
    const { name, teacherId, studentIds } = req.body;

    try {
        // Tạo đối tượng lớp học mới
        const course = new Course({
            name,
            teacher: teacherId,
            students: studentIds || [] // Có thể không truyền nếu không có danh sách sinh viên
        });

        await course.save();
        res.status(201).json({ message: 'Lớp học đã được thêm thành công', course });
    } catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi thêm lớp học', error });
    }
});

module.exports = router;
