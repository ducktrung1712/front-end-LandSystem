import React, { useState, useEffect } from "react";
import axios from "axios";
import AddWorkGroupModal from "./AddWorkGroupModal";
import EditWorkGroupModal from "./EditWorkGroupModal";
import "./WorkGroupManagement.css";

function WorkGroupManagement() {
  const [workGroups, setWorkGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editWorkGroup, setEditWorkGroup] = useState(null);
  const workGroupsPerPage = 9;

  useEffect(() => {
    fetchWorkGroups();
  }, []);

  const fetchWorkGroups = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/workgroups");
      if (Array.isArray(response.data)) {
        setWorkGroups(response.data);
      } else {
        throw new Error("API trả về dữ liệu không hợp lệ.");
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách nhóm công việc:", err);
      setError("Không thể tải dữ liệu nhóm công việc. Hãy kiểm tra API.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/workgroups/${id}`);
      setWorkGroups(workGroups.filter((group) => group.id !== id));
    } catch (err) {
      console.error("Lỗi khi xoá nhóm công việc:", err);
      alert("Không thể xoá nhóm công việc.");
    }
  };

  const handleEdit = (group) => {
    setEditWorkGroup(group);
  };

  const handleAdd = () => {
    setShowAddForm(true);
  };

  const priorityMapping = {
    Low: "Thấp",
    Medium: "Trung bình",
    High: "Cao"
  };
  
  const statusMapping = {
    PENDING: "Chờ xử lý",
    IN_PROGRESS: "Đang thực hiện",
    COMPLETED: "Hoàn thành",
    CANCELLED: "Đã hủy"
  };

  const indexOfLastGroup = currentPage * workGroupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - workGroupsPerPage;
  const currentWorkGroups = workGroups.slice(indexOfFirstGroup, indexOfLastGroup);
  const totalPages = Math.ceil(workGroups.length / workGroupsPerPage);

  return (
    <div className="workgroup-management">
      <div className="header-section">
        <h2>Quản lý Nhóm Công Việc</h2>
        <button className="add-workgroup-button" onClick={handleAdd}>
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
          <table className="workgroup-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tên nhóm</th>
                <th>Mô tả</th>
                <th>Hạn chót</th>
                <th>Ưu tiên</th>
                <th>Trạng thái</th>
                <th>Hình ảnh</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentWorkGroups.map((group) => (
                <tr key={group.id}>
                  <td>{group.id}</td>
                  <td>{group.name}</td>
                  <td>{group.description}</td>
                  <td>{group.deadline}</td>
                  <td>{priorityMapping[group.priority] || "Không xác định"}</td>
                  <td>{statusMapping[group.status] || "Không xác định"}</td>
                  <td>
                    {group.image ? (
                      <img
                        src={`data:image/jpeg;base64,${group.image}`}
                        alt="Hình ảnh nhóm công việc"
                        className="workgroup-image"
                      />
                    ) : (
                      <img
                        src="/placeholder-image.png"
                        alt="Không có ảnh"
                        className="workgroup-image"
                      />
                    )}
                  </td>
                  <td>
                    <button className="edit-button" onClick={() => handleEdit(group)}>✏️</button>
                    <button className="delete-button" onClick={() => handleDelete(group.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button key={index + 1} className={currentPage === index + 1 ? "active" : ""} onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {showAddForm && (
        <AddWorkGroupModal onClose={() => setShowAddForm(false)} onSave={fetchWorkGroups} />
      )}

      {editWorkGroup && (
        <EditWorkGroupModal initialData={editWorkGroup} onClose={() => setEditWorkGroup(null)} onSave={fetchWorkGroups} />
      )}
    </div>
  );
}

export default WorkGroupManagement;
