// src/pages/TeacherDashboard.js
import React, { useState } from 'react';
import TeacherCourses from '../components/TeacherCourses';
import TeacherFeedbackList from '../components/TeacherFeedbackList';
import './TeacherDashboard.css';

function TeacherDashboard({ user }) {
    const [selectedCourseId, setSelectedCourseId] = useState(null);

    const handleSelectCourse = (courseId) => {
        // Kiểm tra nếu courseId đã được chọn, nếu có thì ẩn feedback, nếu không thì hiển thị feedback
        setSelectedCourseId(prevId => (prevId === courseId ? null : courseId));
    };

    return (
        <div className="teacher-dashboard">
            <div className="courses-list">
                <TeacherCourses teacherId={user.id} onSelectCourse={handleSelectCourse} />
            </div>
            <div className="feedback-list">
                {selectedCourseId ? (
                    <TeacherFeedbackList courseId={selectedCourseId} />
                ) : (
                    <p>Hãy chọn một lớp học để xem feedback</p>
                )}
            </div>
        </div>
    );
}

export default TeacherDashboard;
