// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import Login from './components/Login';
import Footer from './components/Footer';
import Header from './components/Header';
import './App.css';

function App() {
    const [user, setUser] = useState(null);

    // Kiểm tra `localStorage` khi ứng dụng khởi chạy để duy trì trạng thái đăng nhập
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // Thiết lập `user` từ `localStorage` nếu có
        }
    }, []);

    return (
        <Router>
            <div className="App">
                <Header user={user} setUser={setUser} />
                <main>
                    <Routes>
                        <Route path="/" element={<Login setUser={setUser} />} />
                        <Route 
                            path="/student" 
                            element={user && user.role === 'student' ? <StudentDashboard user={user} /> : <Login setUser={setUser} />} 
                        />
                        <Route 
                            path="/teacher" 
                            element={user && user.role === 'teacher' ? <TeacherDashboard user={user} /> : <Login setUser={setUser} />} 
                        />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
