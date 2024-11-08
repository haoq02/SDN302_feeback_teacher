import React, { useEffect, useState } from 'react';
import { api } from '../api';
import './TeacherFeedbackList.css';

function TeacherFeedbackList({ courseId }) {
    const [feedbacks, setFeedbacks] = useState([]);
    const [responses, setResponses] = useState({});
    const [showDetailedTable, setShowDetailedTable] = useState(false); // Kiểm soát hiển thị bảng dọc

    useEffect(() => {
        const fetchFeedbacks = async () => {
            if (!courseId) {
                console.error("Missing courseId");
                return;
            }

            try {
                const response = await api.get(`/teacher/feedback/${courseId}`, {
                    withCredentials: true
                });

                if (response.data && response.data.feedbacks) {
                    setFeedbacks(response.data.feedbacks);
                } else {
                    console.warn("Không tìm thấy dữ liệu feedback");
                }
            } catch (error) {
                console.error('Error fetching feedback:', error);
                alert('Có lỗi xảy ra khi tải feedback');
            }
        };

        fetchFeedbacks();
    }, [courseId]);

    const handleResponseChange = (feedbackId, value) => {
        setResponses((prevResponses) => ({
            ...prevResponses,
            [feedbackId]: value,
        }));
    };

    const submitResponse = async (feedbackId) => {
        try {
            const response = responses[feedbackId];
            await api.put(`/teacher/feedback/${feedbackId}/response`, { response });
            alert('Phản hồi đã được cập nhật thành công');
            setFeedbacks((prevFeedbacks) =>
                prevFeedbacks.map((fb) =>
                    fb._id === feedbackId ? { ...fb, response } : fb
                )
            );
        } catch (error) {
            console.error("Error submitting response:", error);
            alert('Có lỗi xảy ra khi gửi phản hồi');
        }
    };

    return (
        <div>
            <h2>Danh sách Feedback</h2>

            {/* Danh sách đơn giản ban đầu */}
            {!showDetailedTable ? (
                <div>
                    {feedbacks.length > 0 ? (
                        feedbacks.map((feedback, index) => (
                            <div key={feedback._id} className="feedback-summary-item">
                                <p><strong>Feedback #{index + 1}</strong></p>
                                <p>Điểm tổng: {feedback.rating}</p>
                                <p>Nhận xét: {feedback.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p>Không có feedback cho lớp học này</p>
                    )}
                    <button onClick={() => setShowDetailedTable(true)}>Xem Chi Tiết</button>
                </div>
            ) : (
                // Hiển thị bảng dọc chi tiết khi showDetailedTable là true
                <table className="feedback-table">
                    <thead>
                        <tr>
                            <th>Feedback #</th>
                            <th>Điểm tổng</th>
                            <th>Giảng dạy và truyền đạt kiến thức</th>
                            <th>Khả năng thu hút sinh viên</th>
                            <th>Kiến thức chuyên môn</th>
                            <th>Mức độ thân thiện</th>
                            <th>Nhận xét</th>
                            <th>Phản hồi của giáo viên</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.map((feedback, index) => (
                            <tr key={feedback._id}>
                                <td>Feedback #{index + 1}</td>
                                <td>{feedback.rating}</td>
                                <td>{feedback.criteria.clarity}</td>
                                <td>{feedback.criteria.engagement}</td>
                                <td>{feedback.criteria.knowledge}</td>
                                <td>{feedback.criteria.approachability}</td>
                                <td>{feedback.comment}</td>
                                <td>
                                    <p>{feedback.response || "Chưa có phản hồi"}</p>
                                    <textarea
                                        value={responses[feedback._id] || ""}
                                        onChange={(e) => handleResponseChange(feedback._id, e.target.value)}
                                        placeholder="Nhập phản hồi của bạn"
                                    />
                                    <button onClick={() => submitResponse(feedback._id)}>Gửi Phản hồi</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default TeacherFeedbackList;
