const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Import cors
require('dotenv').config();

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const teacherRoutes = require('./routes/teacher');

const app = express();

// Cấu hình CORS
app.use(cors({
    origin: 'http://localhost:3000', // Chỉ định nguồn frontend
    credentials: true // Cho phép gửi cookie
}));

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || process.env.SESSION_SECRET, // Sử dụng SESSION_SECRET từ biến môi trường
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Đặt true nếu bạn đang sử dụng HTTPS
}));

// Kết nối MongoDB
mongoose.connect(`${process.env.URL}${process.env.DBNAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Routes
app.use('/auth', authRoutes);
app.use('/student', studentRoutes);
app.use('/teacher', teacherRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
