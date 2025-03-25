import React, { useState } from 'react';
import './homework.css';
import Nhanviec from "../task/Task";
import Baocao from "../report/Report";
import PersonalInfo from "../inforworker/Infores";
function WorkerDashboard() {
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMenuClick = (menuKey) => {
    if (menuKey === 'logout') {
      window.location.href = 'http://localhost:3000/'; // Chuyển hướng về trang chủ
      return;
    }
    setActiveMenu(menuKey);
  };

  const menuItems = [
    { key: 'tasks', label: 'Nhiệm vụ được giao', icon: '📋' },
    { key: 'progress', label: 'Báo cáo tiến độ', icon: '📈' },
    { key: 'profile', label: 'Thông tin bản thân', icon: '👤' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Công nhân</h2>
          <div className="header-divider"></div>
        </div>
        <ul className="menu-list">
          {menuItems.map((item) => (
            <li key={item.key}>
              <button
                className={`menu-button ${activeMenu === item.key ? 'active' : ''}`}
                onClick={() => handleMenuClick(item.key)}
              >
                <span className="menu-icon">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
          <li className="logout-item">
            <button className="menu-button logout-button" onClick={() => handleMenuClick('logout')}>
              <span className="menu-icon">🚪</span>
              Đăng xuất
            </button>
          </li>
        </ul>
      </div>
      {/* Content */}
      <div className="content">
        {activeMenu === "tasks" ? (
          <Nhanviec />
        ):activeMenu === "progress" ? (
          <Baocao />
        ):activeMenu === "profile" ? (
          <PersonalInfo />
        ): activeMenu ? (
          <div className="content-box">
            <h2>{menuItems.find((item) => item.key === activeMenu)?.label}</h2>
            <p>
              Đây là nội dung của {menuItems.find((item) => item.key === activeMenu)?.label}.
            </p>
          </div>
        ) : (
          <div className="content-box">
            <h2>Chọn một mục để quản lý</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkerDashboard;
