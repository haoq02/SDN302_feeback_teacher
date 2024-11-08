// import React, { useState } from 'react';
// import { api } from '../api'; // Import api config
// import { useNavigate } from 'react-router-dom'; // Import useNavigate

// function Login({ setUser }) {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState(null);
//     const navigate = useNavigate(); // Khởi tạo useNavigate

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await api.post('/auth/login', { email, password });
//             setUser(response.data.user); // Lưu thông tin người dùng vào state
//             alert('Đăng nhập thành công');

//             // Chuyển hướng dựa trên vai trò người dùng
//             if (response.data.user.role === 'teacher') {
//                 navigate('/teacher'); // Nếu là giáo viên, chuyển đến trang giáo viên
//             } else if (response.data.user.role === 'student') {
//                 navigate('/student'); // Nếu là sinh viên, chuyển đến trang sinh viên
//             }
//         } catch (error) {
//             setError('Đăng nhập không thành công, vui lòng kiểm tra lại thông tin.');
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <h2>Đăng Nhập</h2>
//             <label>
//                 Email:
//                 <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//             </label>
//             <label>
//                 Mật khẩu:
//                 <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//             </label>
//             <button type="submit">Đăng Nhập</button>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//         </form>
//     );
// }

// export default Login;



// src/components/Login.js
// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { api } from '../api'; // Giả sử bạn có file api.js để cấu hình API
import './Login.css'; // Import file CSS

function Login({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Khởi tạo useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            const userData = response.data.user;

            // Lưu thông tin người dùng vào state và localStorage
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData)); // Lưu vào localStorage
            
            // Điều hướng dựa trên vai trò của người dùng
            if (userData.role === 'student') {
                navigate('/student');
            } else if (userData.role === 'teacher') {
                navigate('/teacher');
            }
        } catch (error) {
            setError('Đăng nhập không thành công, vui lòng kiểm tra lại thông tin.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Đăng Nhập</h2>
            <label>
                Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
                Mật khẩu:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <button type="submit">Đăng Nhập</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}

export default Login;

