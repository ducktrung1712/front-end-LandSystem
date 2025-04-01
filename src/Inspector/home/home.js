import React, { useState } from 'react';
import './home.css';
import LandInspection from '../SoilInspection/LandInspection';
import PersonalInfo from '../inforInspection/PersonalInfor';
import TaskList from '../taskInspector/taskInspector';
import ReportPage from '../reportInspector/reportInspector';
function InspectorDashboard() {
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMenuClick = (menuKey) => {
    if (menuKey === 'logout') {
      window.location.href = 'http://localhost:3000/';
      return;
    }
    setActiveMenu(menuKey);
  };

  const menuItems = [
    { key: 'lands', label: 'Kiểm tra đất', icon: '🗺️' },
    { key: 'jobs', label: 'Danh sách công việc', icon: '🛠️' },
    { key: 'reports', label: 'Gửi báo cáo', icon: '📊' },
    { key: 'profile', label: 'Thông tin bản thân', icon: '👤' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Thanh tra</h2>
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
      <div className="content">
        {activeMenu === 'lands' ? (
          <LandInspection />
        ):activeMenu === "profile" ? (
          <PersonalInfo />
        ):activeMenu === "jobs" ? (
          <TaskList />
        ):activeMenu === "reports" ? (
          <ReportPage />
        ): activeMenu ? (
          <div className="content-box">
            <h2>{menuItems.find((item) => item.key === activeMenu)?.label}</h2>
            <p>Đây là nội dung của {menuItems.find((item) => item.key === activeMenu)?.label}.</p>
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

export default InspectorDashboard;