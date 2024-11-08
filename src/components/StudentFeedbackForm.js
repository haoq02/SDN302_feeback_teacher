import React, { useState, useEffect } from 'react';
import { api } from '../api';
import './StudentFeedbackForm.css'; // Import CSS ở đây

function StudentFeedbackForm({ courses, studentId }) {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [feedback, setFeedback] = useState({
        rating: 1,
        criteria: { clarity: 1, engagement: 1, knowledge: 1, approachability: 1 },
        comment: '',
    });
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        console.log("Dữ liệu courses nhận được từ props:", courses);
    }, [courses]);

    const handleCourseChange = (e) => {
        setSelectedCourse(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const feedbackData = {
            courseId: selectedCourse,
            studentId: studentId,
            rating: feedback.rating,
            criteria: feedback.criteria,
            comment: feedback.comment,
        };
    
        try {
            const response = await api.post('/student/feedback', feedbackData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setSuccessMessage(response.data.message);
            setFeedback({
                rating: 1,
                criteria: { clarity: 1, engagement: 1, knowledge: 1, approachability: 1 },
                comment: ''
            });
            setSelectedCourse('');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert(error.response.data.message); // Hiển thị thông báo nếu feedback đã tồn tại
            } else {
                console.error("Error sending feedback:", error);
                alert('Có lỗi xảy ra khi gửi feedback');
            }
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <h2>Gửi Feedback</h2>

            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

            <label>
                Chọn lớp học:
                <select value={selectedCourse} onChange={handleCourseChange} required>
                    <option value="">-- Chọn lớp học --</option>
                    {courses.map((course) => (
                        <option key={course._id} value={course._id}>{course.name}</option>
                    ))}
                </select>
            </label>

            <label>Điểm tổng:
                <input
                    type="number"
                    name="rating"
                    value={feedback.rating}
                    onChange={(e) => setFeedback({ ...feedback, rating: Number(e.target.value) })}
                    min="1"
                    max="5"
                />
            </label>
            <label>Giảng dạy và truyền đạt kiến thức của giáo viên:
                <input
                    type="number"
                    name="clarity"
                    value={feedback.criteria.clarity}
                    onChange={(e) => setFeedback({ 
                        ...feedback, 
                        criteria: { ...feedback.criteria, clarity: Number(e.target.value) } 
                    })}
                    min="1"
                    max="5"
                />
            </label>
            <label>Khả năng thu hút sinh viên tham gia vào bài học của giáo viên:
                <input
                    type="number"
                    name="engagement"
                    value={feedback.criteria.engagement}
                    onChange={(e) => setFeedback({ 
                        ...feedback, 
                        criteria: { ...feedback.criteria, engagement: Number(e.target.value) } 
                    })}
                    min="1"
                    max="5"
                />
            </label>
            <label>Kiến thức chuyên môn về môn học của giáo viên:
                <input
                    type="number"
                    name="knowledge"
                    value={feedback.criteria.knowledge}
                    onChange={(e) => setFeedback({ 
                        ...feedback, 
                        criteria: { ...feedback.criteria, knowledge: Number(e.target.value) } 
                    })}
                    min="1"
                    max="5"
                />
            </label>
            <label>Mức độ thân thiện, sẵn sàng lắng nghe và hỗ trợ của giáo viên:
                <input
                    type="number"
                    name="approachability"
                    value={feedback.criteria.approachability}
                    onChange={(e) => setFeedback({ 
                        ...feedback, 
                        criteria: { ...feedback.criteria, approachability: Number(e.target.value) } 
                    })}
                    min="1"
                    max="5"
                />
            </label>
            <label>Nhận xét:
                <textarea
                    name="comment"
                    value={feedback.comment}
                    onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                />
            </label>

            <button type="submit">Gửi Feedback</button>
        </form>
    );
}

export default StudentFeedbackForm;
