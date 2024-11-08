const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import model User

// Đăng nhập
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        // Lưu thông tin người dùng vào session
        req.session.userId = user._id;
        req.session.role = user.role;

        // Lưu thông tin khác tùy theo vai trò
        if (user.role === 'teacher') {
            req.session.teacherId = user._id; // Lưu thêm teacherId nếu là giáo viên
        }

        res.status(200).json({ message: 'Đăng nhập thành công', user: { id: user._id, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra', error });
    }
});


// Đăng xuất
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Có lỗi xảy ra khi đăng xuất', error: err });
        }

        res.status(200).json({ message: 'Đăng xuất thành công' });
    });
});


module.exports = router;
