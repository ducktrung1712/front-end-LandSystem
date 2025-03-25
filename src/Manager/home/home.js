import React, { useState } from "react";
import "./home.css";
import UserManagement from "../users/UserManagement";    
import AreaManagement from "../areas/AreaManagement";      
import LandManagement from "../lands/LandManagement";      
import OwnerManagement from "../owner/OwnerManagement";   
import JobManagement from "../job/JobManagement";  
import WorkGroupManagement from "../workgroups/WorkGroupManagement";
import ReportManagement from "../report/ReportManagement";

function ManagerDashboard() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleMenuClick = (menuKey) => {
    if (menuKey === "logout") {
      window.location.href = "http://localhost:3000/";
      return;
    }
    setActiveMenu(menuKey);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const menuItems = [
    { key: "areas", label: "Quản lý khu vực", icon: "🌍" },
    { key: "lands", label: "Quản lý đất", icon: "🗺️" },
    { key: "profile", label: "Quản lý chủ sở hữu", icon: "👤" },
    { key: "users", label: "Quản lý nhân viên", icon: "👥" },
    { key: "jobs", label: "Quản lý công việc", icon: "🛠️" },
    { key: "workgroups", label: "Quản lý nhóm làm việc", icon: "👨‍👩‍👦" },
    { key: "reports", label: "Quản lý báo cáo", icon: "📊" },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`dashboard-sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <button className="collapse-button" onClick={toggleSidebar}>
            {isSidebarCollapsed ? "➡️" : "⬅️"}
          </button>
          {!isSidebarCollapsed && <h2>Quản lý</h2>}
          <div className="header-divider"></div>
        </div>
        <ul className="menu-list">
          {menuItems.map((item) => (
            <li key={item.key}>
              <button
                className={`menu-button ${activeMenu === item.key ? "active" : ""}`}
                onClick={() => handleMenuClick(item.key)}
              >
                <span className="menu-icon">{item.icon}</span>
                {!isSidebarCollapsed && <span className="menu-label">{item.label}</span>}
              </button>
            </li>
          ))}
          <li className="logout-item">
            <button
              className="menu-button logout-button"
              onClick={() => handleMenuClick("logout")}
            >
              <span className="menu-icon">🚪</span>
              {!isSidebarCollapsed && <span className="menu-label">Đăng xuất</span>}
            </button>
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="content">
        {activeMenu === "users" ? (
          <UserManagement />
        ) : activeMenu === "areas" ? (
          <AreaManagement />
        ) : activeMenu === "lands" ? (
          <LandManagement />
        ) : activeMenu === "profile" ? (
          <OwnerManagement />
        ) : activeMenu === "jobs" ? (
          <JobManagement />
        ) : activeMenu === "workgroups" ? (
          <WorkGroupManagement />
        ) : activeMenu === "reports" ? ( // Hiển thị ReportManagement
          <ReportManagement />
        ) : (
          <div className="content-box">
            <h2>Chọn một mục để quản lý</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerDashboard;
