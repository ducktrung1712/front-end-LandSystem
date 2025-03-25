import React, { useState, useEffect } from "react";
import axios from "axios";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import "./UserManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [workgroups, setWorkgroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const usersPerPage = 9;

  useEffect(() => {
    fetchUsers();
    fetchWorkgroups();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users");
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        throw new Error("API trả về dữ liệu không hợp lệ.");
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách người dùng:", err);
      setError("Không thể tải dữ liệu người dùng. Hãy kiểm tra API.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkgroups = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/workgroups");
      console.log("Dữ liệu nhóm công việc:", response.data);
      if (Array.isArray(response.data)) {
        setWorkgroups(response.data);
      }
    } catch (err) {
      console.error("Lỗi khi lấy nhóm công việc:", err);
    }
  };
  
  const getWorkgroupName = (workGroup) => {
    if (!workGroup) return "Chưa có nhóm";
    return workGroup.name;
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Lỗi khi xoá người dùng:", err);
      alert("Không thể xoá người dùng.");
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
  };

  const handleAdd = () => {
    setShowAddForm(true);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="user-management">
      <div className="header-section">
        <h2>Quản lý người dùng</h2>
        <button className="add-user-button" onClick={handleAdd}>
          <span className="plus-icon">+</span>
          Thêm mới
        </button>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loader"></div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Họ tên</th>
                <th>Tài khoản</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Nhóm công việc</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers
                .filter((user) => user.role !== "Manager")
                .map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.fullName}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="role-badge">{user.role}</span>
                    </td>
                    <td>{getWorkgroupName(user.workGroup)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(user)}
                        >
                          ✏️
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(user.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={currentPage === index + 1 ? "active" : ""}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {showAddForm && (
        <AddUserModal
          onClose={() => setShowAddForm(false)}
          onUserAdded={fetchUsers}
        />
      )}

      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onUserUpdated={fetchUsers}
        />
      )}
    </div>
  );
}

export default UserManagement;
