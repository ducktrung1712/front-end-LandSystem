import React, { useState } from "react";
import axios from "axios";
import "./AddAreaModal.css"; // CSS cho modal (tùy chỉnh theo nhu cầu)

function AddAreaModal({ onClose, onAreaAdded }) {
  const [name, setName] = useState("");
  const [totalArea, setTotalArea] = useState("");
  const [priorityLandType, setPriorityLandType] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null); // Lưu chuỗi Base64 của hình ảnh
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Xử lý khi người dùng chọn file hình ảnh và hiển thị preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Sử dụng FileReader để chuyển file thành chuỗi Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        // reader.result có dạng "data:image/jpeg;base64,...", lấy phần sau dấu phẩy
        const base64String = reader.result.split(",")[1];
        setImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra các trường bắt buộc phải điền
    if (
      !name.trim() ||
      !totalArea ||
      !priorityLandType.trim() ||
      !description.trim() ||
      !image
    ) {
      setError("Vui lòng điền đầy đủ thông tin, bao gồm hình ảnh.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const newArea = {
        name,
        totalArea: parseFloat(totalArea),
        priorityLandType,
        description,
        image, // Gửi hình ảnh dưới dạng chuỗi Base64 (nếu có)
      };
      // Gọi API tạo khu vực mới
      await axios.post("http://localhost:8080/api/areas", newArea);
      onAreaAdded(); // Làm mới danh sách khu vực sau khi thêm
      onClose();     // Đóng modal
    } catch (err) {
      console.error("Lỗi khi thêm khu vực:", err);
      setError("Lỗi khi thêm khu vực. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Thêm khu vực mới</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên khu vực</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Diện tích</label>
            <input
              type="number"
              step="0.01"
              value={totalArea}
              onChange={(e) => setTotalArea(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Loại đất ưu tiên</label>
            <input
              type="text"
              value={priorityLandType}
              onChange={(e) => setPriorityLandType(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Hình ảnh</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {/* Hiển thị preview nếu có hình ảnh */}
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
              {loading ? "Đang xử lý..." : "Thêm khu vực"}
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

export default AddAreaModal;
