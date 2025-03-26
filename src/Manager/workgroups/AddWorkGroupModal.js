import React, { useState } from "react";
import axios from "axios";
import "./AddWorkGroupModal.css"; // CSS cho modal

function AddWorkGroupModal({ onClose, onWorkGroupAdded, initialData }) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [deadline, setDeadline] = useState(initialData?.deadline || "");
  const [priority, setPriority] = useState(initialData?.priority || "Medium");
  const [status, setStatus] = useState(initialData?.status || "IN_PROGRESS");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra các trường bắt buộc
    if (!name.trim() || !description.trim() || !deadline ) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const workGroupData = {
        name,
        description,
        deadline,
        priority,
        status,
      };

      if (initialData) {
        await axios.put(`http://localhost:8080/api/workgroups/${initialData.id}`, workGroupData);
      } else {
        await axios.post("http://localhost:8080/api/workgroups", workGroupData);
      }
      onWorkGroupAdded(); // Làm mới danh sách nhóm công việc
      onClose(); // Đóng modal
    } catch (err) {
      console.error("Lỗi khi lưu nhóm công việc:", err);
      setError("Lỗi khi lưu nhóm công việc. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{initialData ? "Chỉnh Sửa Nhóm Công Việc" : "Thêm Nhóm Công Việc"}</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên Nhóm:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Mô Tả:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Hạn Chót:</label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Ưu Tiên:</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="High">Cao</option>
              <option value="Medium">Trung bình</option>
              <option value="Low">thấp</option>
            </select>
          </div>

          <div className="form-group">
            <label>Trạng Thái:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="IN_PROGRESS">Đang thực hiện</option>
              <option value="COMPLETED">Hoàn thành</option>
            </select>
          </div>

          <div className="form-buttons">
            <button type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : initialData ? "Cập Nhật" : "Thêm Nhóm"}
            </button>
            <button type="button" onClick={onClose} disabled={loading}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddWorkGroupModal;
