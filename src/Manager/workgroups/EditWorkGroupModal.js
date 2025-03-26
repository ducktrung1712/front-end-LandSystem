import React, { useState } from "react";
import axios from "axios";
import "./EditWorkGroupModal.css";

const EditWorkGroupModal = ({ initialData, onClose, onSave }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [deadline, setDeadline] = useState(initialData?.deadline || "");
  const [priority, setPriority] = useState(initialData?.priority || "Medium");
  const [status, setStatus] = useState(initialData?.status || "IN_PROGRESS");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !deadline) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    setLoading(true);
    setError("");

    const updatedWorkGroup = {
      id: initialData?.id, 
      name,
      description,
      deadline,
      priority,
      status,
    };

    try {
      await axios.put(`http://localhost:8080/api/workgroups/${updatedWorkGroup.id}`, updatedWorkGroup, {
        headers: { 'Content-Type': 'application/json' },
      });

      onSave();
      onClose();
    } catch (err) {
      console.error("Lỗi khi cập nhật nhóm công việc:", err);
      setError("Lỗi khi cập nhật nhóm công việc. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Chỉnh sửa Nhóm Công Việc</h3>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Mã nhóm:</label>
          <input type="text" value={initialData?.id} disabled />

          <label>Tên nhóm:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

          <label>Mô tả:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

          <label>Hạn chót:</label>
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />

          <label>Ưu tiên:</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="Low">Thấp</option>
            <option value="Medium">Trung bình</option>
            <option value="High">Cao</option>
          </select>

          <label>Trạng thái:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="IN_PROGRESS">Đang thực hiện</option>
            <option value="COMPLETED">Hoàn thành</option>
          </select>

          <div className="modal-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : "Cập nhật"}
            </button>
            <button type="button" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWorkGroupModal;

