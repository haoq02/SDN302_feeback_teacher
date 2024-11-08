// src/components/Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-title">FPT University Feedback Portal</div>
      <nav className="navbar">
        {/* Giữ chỗ trống cho nút Logout khi chưa đăng nhập */}
        {user ? (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <div className="placeholder-btn" />
        )}
      </nav>
    </header>
  );
};

export default Header;
