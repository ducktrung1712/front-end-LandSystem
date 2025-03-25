import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LandModal.css"; // Sử dụng CSS chung cho modal

function AddLandModal({ onClose, onLandAdded }) {
  // State cho dropdown khu vực và chủ sở hữu
  const [areas, setAreas] = useState([]);
  const [owners, setOwners] = useState([]); // Lấy danh sách chủ sở hữu từ CSDL

  // State lưu giá trị đã chọn
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [selectedOwnerId, setSelectedOwnerId] = useState("");

  // Các trường khác
  const [landArea, setLandArea] = useState("");
  const [location, setLocation] = useState("");
  // Giao diện hiển thị trạng thái bằng tiếng Việt
  const [status, setStatus] = useState("Chưa sử dụng");
  const [landType, setLandType] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null); // Lưu chuỗi Base64 của hình ảnh
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch danh sách khu vực và chủ sở hữu khi component mount
  useEffect(() => {
    fetchAreas();
    fetchOwners();
  }, []);

  const fetchAreas = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/areas");
      if (Array.isArray(response.data)) {
        setAreas(response.data);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách khu vực:", err);
    }
  };

  // Lấy danh sách chủ sở hữu từ endpoint /owners
  const fetchOwners = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/owners");
      if (Array.isArray(response.data)) {
        setOwners(response.data);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách chủ sở hữu:", err);
    }
  };

  // Xử lý chọn hình ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Dùng FileReader để chuyển file thành chuỗi Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        // Lấy phần sau dấu phẩy
        const base64String = reader.result.split(",")[1];
        setImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Hàm chuyển đổi trạng thái từ tiếng Việt sang tiếng Anh trước khi gửi lên backend
  const convertStatusToEnglish = (statusVietnamese) => {
    if (statusVietnamese === "Chưa sử dụng") return "Unused";
    if (statusVietnamese === "Đang sử dụng") return "In use";
    if (statusVietnamese === "Cần kiểm tra") return "Needs inspection";
    return statusVietnamese;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Yêu cầu các trường bắt buộc: Diện tích, Vị trí, Trạng thái và Loại đất
    if (!landArea || !location.trim() || !status || !landType.trim()) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc: Diện tích, Vị trí, Trạng thái và Loại đất.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Chuyển đổi giá trị status sang tiếng Anh trước khi gửi
      const englishStatus = convertStatusToEnglish(status);
      
      const newLand = {
        areaId: selectedAreaId ? parseInt(selectedAreaId) : null,
        ownerId: selectedOwnerId ? parseInt(selectedOwnerId) : null,
        area: parseFloat(landArea),
        location: location.trim(),
        status: englishStatus,
        landType: landType.trim(),
        description: description.trim(),
        image, // Nếu có hình ảnh, gửi dưới dạng chuỗi Base64
      };
      await axios.post("http://localhost:8080/api/lands", newLand);
      onLandAdded(); // Làm mới danh sách đất sau khi thêm
      onClose();     // Đóng modal
    } catch (err) {
      console.error("Lỗi khi thêm đất:", err);
      setError("Lỗi khi thêm đất. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Thêm đất mới</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Khu vực</label>
            <select
              value={selectedAreaId}
              onChange={(e) => setSelectedAreaId(e.target.value)}
            >
              <option value="">Chọn khu vực</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Chủ sở hữu</label>
            <select
              value={selectedOwnerId}
              onChange={(e) => setSelectedOwnerId(e.target.value)}
            >
              <option value="">Chọn chủ sở hữu</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.fullName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Diện tích (bắt buộc)</label>
            <input
              type="number"
              step="0.01"
              value={landArea}
              onChange={(e) => setLandArea(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Vị trí (bắt buộc)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Trạng thái (bắt buộc)</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} required>
              <option value="Chưa sử dụng">Chưa sử dụng</option>
              <option value="Đang sử dụng">Đang sử dụng</option>
              <option value="Cần kiểm tra">Cần kiểm tra</option>
            </select>
          </div>
          <div className="form-group">
            <label>Loại đất (bắt buộc)</label>
            <input
              type="text"
              value={landType}
              onChange={(e) => setLandType(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Hình ảnh</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {image && (
              <img
                src={`data:image/jpeg;base64,${image}`}
                alt="Xem trước"
                style={{ width: "100px", height: "auto", marginTop: "10px" }}
              />
            )}
          </div>
          <div className="form-buttons">
            <button type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : "Thêm đất"}
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

export default AddLandModal;
