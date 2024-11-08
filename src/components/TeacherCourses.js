// src/components/TeacherCourses.js
import React, { useEffect, useState } from 'react';
import { api } from '../api';

function TeacherCourses({ teacherId, onSelectCourse }) {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get(`/teacher/courses/${teacherId}`, {
                    withCredentials: true
                });
                setCourses(response.data.courses);
            } catch (error) {
                console.error('Error fetching courses:', error);
                alert('Có lỗi xảy ra khi tải danh sách lớp học');
            }
        };
        fetchCourses();
    }, [teacherId]);

    const handleCourseClick = (courseId) => {
        setSelectedCourse(prevId => (prevId === courseId ? null : courseId));
        onSelectCourse(courseId);
    };

    return (
        <div>
            <h2>Danh sách Lớp học</h2>
            <ul>
                {courses.map((course) => (
                    <li
                        key={course._id}
                        onClick={() => handleCourseClick(course._id)}
                        style={{
                            cursor: 'pointer',
                            fontWeight: selectedCourse === course._id ? 'bold' : 'normal',
                            color: selectedCourse === course._id ? '#007bff' : 'inherit',
                        }}
                    >
                        {course.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TeacherCourses;
