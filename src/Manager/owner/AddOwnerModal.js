import React, { useState } from "react";
import axios from "axios";
import "./OwnerModal.css";// Tùy chỉnh file CSS nếu cần

function AddOwnerModal({ onClose, onOwnerAdded }) {
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  // Giao diện hiển thị là tiếng Việt
  const [transactionStatus, setTransactionStatus] = useState("Sở hữu");
  const [changeHistory, setChangeHistory] = useState("");
  const [error, setError] = useState("");

  // Hàm chuyển đổi từ tiếng Việt sang tiếng Anh
  const convertStatusToEnglish = (status) => {
    if (status === "Sở hữu") {
      return "Owned";
    } else if (status === "Chuyển giao") {
      return "Transferred";
    }
    return status; // Nếu không khớp, trả về nguyên status
  };

  // Hàm kiểm tra dữ liệu nhập
  const validateForm = () => {
    if (!fullName.trim()) {
      setError("Họ và tên không được để trống.");
      return false;
    }
    if (!address.trim()) {
      setError("Địa chỉ không được để trống.");
      return false;
    }
    // Bạn có thể bổ sung thêm kiểm tra cho contact hoặc các trường khác nếu cần
    setError(""); // Xóa lỗi nếu dữ liệu hợp lệ
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra dữ liệu trước khi gửi
    if (!validateForm()) return;
    
    // Chuyển đổi giá trị transactionStatus trước khi gửi lên backend
    const englishStatus = convertStatusToEnglish(transactionStatus);
    
    const newOwner = {
      fullName,
      contact,
      address,
      transactionStatus: englishStatus,
      changeHistory,
    };

    try {
      const response = await axios.post("http://localhost:8080/api/owners", newOwner);
      if (response.data) {
        onOwnerAdded(); // Gọi lại hàm load danh sách chủ sở hữu sau khi thêm thành công
        onClose(); // Đóng modal
      }
    } catch (err) {
      console.error("Lỗi khi thêm chủ sở hữu:", err);
      setError("Lỗi khi thêm chủ sở hữu.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Thêm Chủ Sở Hữu Mới</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ và Tên:</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Liên hệ:</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Địa chỉ:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Trạng thái giao dịch:</label>
            <select
              value={transactionStatus}
              onChange={(e) => setTransactionStatus(e.target.value)}
              required
            >
              <option value="Sở hữu">Sở hữu</option>
              <option value="Chuyển giao">Chuyển giao</option>
            </select>
          </div>
          <div className="form-group">
            <label>Lịch sử thay đổi:</label>
            <textarea
              value={changeHistory}
              onChange={(e) => setChangeHistory(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="submit-button">
              Thêm mới
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddOwnerModal;
