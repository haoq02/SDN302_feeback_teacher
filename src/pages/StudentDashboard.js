import React, { useEffect, useState } from 'react';
import { api } from '../api'; // Đảm bảo file này có cấu hình cho API
import StudentFeedbackForm from '../components/StudentFeedbackForm';
import './StudentDashboard.css';

function StudentDashboard({ user }) {
    const [courses, setCourses] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [editingFeedbackId, setEditingFeedbackId] = useState(null); // Kiểm soát feedback đang chỉnh sửa
    const [editedFeedbacks, setEditedFeedbacks] = useState({}); // Lưu các chỉnh sửa
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;

        const fetchCourses = async () => {
            try {
                const response = await api.get(`/student/courses/${user.id}`);
                setCourses(response.data.courses);
            } catch (error) {
                console.error("Error fetching courses:", error);
                setError("Có lỗi xảy ra khi tải danh sách khóa học");
            }
        };

        const fetchFeedbacks = async () => {
            try {
                const response = await api.get(`/student/feedbacks/${user.id}`);
                setFeedbacks(response.data.feedbacks);
            } catch (error) {
                console.error("Error fetching feedbacks:", error);
                setError("Có lỗi xảy ra khi tải feedback");
            }
        };

        fetchCourses();
        fetchFeedbacks();
    }, [user]);

    const handleEditClick = (feedback) => {
        if (feedback.edited) {
            alert("Bạn không được chỉnh sửa lại feedback này.");
            return;
        }

        setEditingFeedbackId(feedback._id);
        setEditedFeedbacks({
            ...editedFeedbacks,
            [feedback._id]: {
                rating: feedback.rating,
                comment: feedback.comment,
                criteria: feedback.criteria || {
                    clarity: 1,
                    engagement: 1,
                    knowledge: 1,
                    approachability: 1
                }
            }
        });
    };

    const handleInputChange = (feedbackId, field, value, isCriteria = false) => {
        setEditedFeedbacks((prev) => ({
            ...prev,
            [feedbackId]: {
                ...prev[feedbackId],
                [isCriteria ? 'criteria' : field]: isCriteria
                    ? { ...prev[feedbackId].criteria, [field]: value }
                    : value,
            }
        }));
    };

    const handleSaveEdit = async (feedbackId) => {
        try {
            const updatedFeedback = editedFeedbacks[feedbackId];
            console.log("Dữ liệu cập nhật đang gửi:", updatedFeedback); // Kiểm tra dữ liệu trước khi gửi
    
            const response = await api.put(`/student/feedback/${feedbackId}`, updatedFeedback); // Sửa lại URL cho đúng endpoint
            console.log("Phản hồi từ server:", response.data); // Ghi lại phản hồi từ server để kiểm tra lỗi
    
            setFeedbacks((prev) =>
                prev.map((fb) =>
                    fb._id === feedbackId ? { ...fb, ...updatedFeedback, edited: true } : fb
                )
            );
            setEditingFeedbackId(null); // Kết thúc chế độ chỉnh sửa
        } catch (error) {
            console.error("Error updating feedback:", error);
            alert("Có lỗi xảy ra khi cập nhật feedback");
        }
    };

    if (error) return <div>{error}</div>;

    return (
        <div className="dashboard-container">
            <h1>Trang của Sinh viên</h1>
            <StudentFeedbackForm 
                courses={courses} 
                studentId={user.id} 
            />
            <h2 className="feedback-title">Danh sách Feedback</h2>
            <div className="table-container">
                <table className="feedback-table">
                    <thead>
                        <tr>
                            <th>Tên lớp</th>
                            <th>Tên giáo viên</th>
                            <th>Sinh viên</th>
                            <th>Điểm tổng</th>
                            <th>Giảng dạy và truyền đạt kiến thức</th>
                            <th>Khả năng thu hút sinh viên</th>
                            <th>Kiến thức chuyên môn</th>
                            <th>Mức độ thân thiện</th>
                            <th>Nhận xét</th>
                            <th>Phản hồi của giáo viên</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.map((feedback) => (
                            <tr key={feedback._id}>
                                <td>{feedback.course?.name}</td>
                                <td>{feedback.teacher?.name}</td>
                                <td>{feedback.student?.name}</td>
                                <td>
                                    {editingFeedbackId === feedback._id ? (
                                        <input
                                            type="number"
                                            value={editedFeedbacks[feedback._id]?.rating || feedback.rating}
                                            onChange={(e) =>
                                                handleInputChange(feedback._id, 'rating', e.target.value)
                                            }
                                            min="1"
                                            max="5"
                                        />
                                    ) : (
                                        feedback.rating
                                    )}
                                </td>
                                <td>
                                    {editingFeedbackId === feedback._id ? (
                                        <input
                                            type="number"
                                            value={editedFeedbacks[feedback._id]?.criteria.clarity || feedback.criteria?.clarity || 1}
                                            onChange={(e) =>
                                                handleInputChange(feedback._id, 'clarity', e.target.value, true)
                                            }
                                            min="1"
                                            max="5"
                                        />
                                    ) : (
                                        feedback.criteria?.clarity || 1
                                    )}
                                </td>
                                <td>
                                    {editingFeedbackId === feedback._id ? (
                                        <input
                                            type="number"
                                            value={editedFeedbacks[feedback._id]?.criteria.engagement || feedback.criteria?.engagement || 1}
                                            onChange={(e) =>
                                                handleInputChange(feedback._id, 'engagement', e.target.value, true)
                                            }
                                            min="1"
                                            max="5"
                                        />
                                    ) : (
                                        feedback.criteria?.engagement || 1
                                    )}
                                </td>
                                <td>
                                    {editingFeedbackId === feedback._id ? (
                                        <input
                                            type="number"
                                            value={editedFeedbacks[feedback._id]?.criteria.knowledge || feedback.criteria?.knowledge || 1}
                                            onChange={(e) =>
                                                handleInputChange(feedback._id, 'knowledge', e.target.value, true)
                                            }
                                            min="1"
                                            max="5"
                                        />
                                    ) : (
                                        feedback.criteria?.knowledge || 1
                                    )}
                                </td>
                                <td>
                                    {editingFeedbackId === feedback._id ? (
                                        <input
                                            type="number"
                                            value={editedFeedbacks[feedback._id]?.criteria.approachability || feedback.criteria?.approachability || 1}
                                            onChange={(e) =>
                                                handleInputChange(feedback._id, 'approachability', e.target.value, true)
                                            }
                                            min="1"
                                            max="5"
                                        />
                                    ) : (
                                        feedback.criteria?.approachability || 1
                                    )}
                                </td>
                                <td>
                                    {editingFeedbackId === feedback._id ? (
                                        <input
                                            type="text"
                                            value={editedFeedbacks[feedback._id]?.comment || feedback.comment}
                                            onChange={(e) =>
                                                handleInputChange(feedback._id, 'comment', e.target.value)
                                            }
                                        />
                                    ) : (
                                        feedback.comment
                                    )}
                                </td>
                                <td>{feedback.response || "Chưa có phản hồi"}</td>
                                <td>
                                    {editingFeedbackId === feedback._id ? (
                                        <button onClick={() => handleSaveEdit(feedback._id)}>
                                            Lưu
                                        </button>
                                    ) : (
                                        <button onClick={() => handleEditClick(feedback)}>
                                            {feedback.edited ? "Đã chỉnh sửa" : "Chỉnh sửa"}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StudentDashboard;
