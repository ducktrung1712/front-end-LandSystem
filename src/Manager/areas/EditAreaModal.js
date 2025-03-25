import React, { useState } from "react";
import axios from "axios";
import "./EditAreaModal.css"; // Tùy chỉnh CSS cho modal nếu cần

function EditAreaModal({ area, onClose, onAreaUpdated }) {
  // Khởi tạo state với dữ liệu hiện có của khu vực
  const [name, setName] = useState(area.name || "");
  const [totalArea, setTotalArea] = useState(area.totalArea || "");
  const [priorityLandType, setPriorityLandType] = useState(area.priorityLandType || "");
  const [description, setDescription] = useState(area.description || "");
  // State image dùng để cập nhật hình ảnh mới nếu có; nếu không, giữ hình ảnh cũ từ area.image
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Xử lý khi người dùng chọn file hình ảnh mới
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
    // Kiểm tra các trường bắt buộc: nếu không có dữ liệu (sau khi trim) hoặc nếu không có hình ảnh (cả mới và cũ)
    if (
      !name.trim() ||
      !totalArea ||
      !priorityLandType.trim() ||
      !description.trim() ||
      (!(image) && !area.image)
    ) {
      setError("Vui lòng điền đầy đủ thông tin, bao gồm hình ảnh.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const updatedArea = {
        name,
        totalArea: parseFloat(totalArea),
        priorityLandType,
        description,
        // Nếu người dùng không chọn hình ảnh mới thì giữ nguyên hình ảnh cũ
        image: image || area.image,
      };

      // Gọi API cập nhật khu vực (PUT)
      await axios.put(`http://localhost:8080/api/areas/${area.id}`, updatedArea);
      onAreaUpdated(); // Làm mới danh sách sau khi cập nhật
      onClose();       // Đóng modal
    } catch (err) {
      console.error("Lỗi khi cập nhật khu vực:", err);
      setError("Lỗi khi cập nhật khu vực. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Chỉnh sửa khu vực</h2>
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
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {/* Hiển thị preview hình ảnh: ưu tiên hình ảnh mới nếu có, nếu không thì hiển thị hình ảnh cũ */}
            {(image || area.image) && (
              <img
                src={`data:image/jpeg;base64,${image || area.image}`}
                alt="Preview"
                style={{ width: "100px", height: "auto", marginTop: "10px" }}
              />
            )}
          </div>
          <div className="form-buttons">
            <button type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : "Cập nhật"}
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

export default EditAreaModal;
