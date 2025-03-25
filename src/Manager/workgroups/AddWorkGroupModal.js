import React, { useState } from "react";
import axios from "axios";
import "./AddWorkGroupModal.css"; // CSS cho modal

function AddWorkGroupModal({ onClose, onWorkGroupAdded, initialData }) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [deadline, setDeadline] = useState(initialData?.deadline || "");
  const [priority, setPriority] = useState(initialData?.priority || "Medium");
  const [status, setStatus] = useState(initialData?.status || "IN_PROGRESS");
  const [image, setImage] = useState(initialData?.image || null); // Base64
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Xử lý khi người dùng chọn file ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        setImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra các trường bắt buộc
    if (!name.trim() || !description.trim() || !deadline || !image) {
      setError("Vui lòng điền đầy đủ thông tin, bao gồm hình ảnh.");
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
        image, // Base64
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
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="form-group">
            <label>Trạng Thái:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>

          <div className="form-group">
            <label>Hình Ảnh:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {image && (
              <img
                src={`data:image/jpeg;base64,${image}`}
                alt="Preview"
                style={{ width: "100px", height: "auto", marginTop: "10px" }}
              />
            )}
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
