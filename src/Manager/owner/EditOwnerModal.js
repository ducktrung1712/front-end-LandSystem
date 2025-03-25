import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OwnerModal.css";// Tùy chỉnh file CSS nếu cần

function EditOwnerModal({ owner, onClose, onOwnerUpdated }) {
  // Khởi tạo state với giá trị từ owner được chọn
  const [fullName, setFullName] = useState(owner.fullName || "");
  const [contact, setContact] = useState(owner.contact || "");
  const [address, setAddress] = useState(owner.address || "");
  // Nếu dữ liệu ban đầu là "Owned" hoặc "Transferred", chuyển thành hiển thị tiếng Việt
  const [transactionStatus, setTransactionStatus] = useState(
    owner.transactionStatus === "Transferred" ? "Chuyển giao" : "Sở hữu"
  );
  const [changeHistory, setChangeHistory] = useState(owner.changeHistory || "");
  const [error, setError] = useState("");

  // Khi owner thay đổi, cập nhật lại state
  useEffect(() => {
    setFullName(owner.fullName || "");
    setContact(owner.contact || "");
    setAddress(owner.address || "");
    setTransactionStatus(
      owner.transactionStatus === "Transferred" ? "Chuyển giao" : "Sở hữu"
    );
    setChangeHistory(owner.changeHistory || "");
  }, [owner]);

  // Hàm chuyển đổi trạng thái từ tiếng Việt sang tiếng Anh
  const convertStatusToEnglish = (status) => {
    if (status === "Sở hữu") return "Owned";
    if (status === "Chuyển giao") return "Transferred";
    return status;
  };

  // Hàm kiểm tra dữ liệu nhập (validation)
  const validateForm = () => {
    if (!fullName.trim()) {
      setError("Họ và tên không được để trống.");
      return false;
    }
    if (!address.trim()) {
      setError("Địa chỉ không được để trống.");
      return false;
    }
    // Bạn có thể bổ sung thêm các kiểm tra khác nếu cần
    setError(""); // Xóa lỗi nếu dữ liệu hợp lệ
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra dữ liệu trước khi gửi
    if (!validateForm()) return;
    
    // Chuyển đổi giá trị transactionStatus sang tiếng Anh trước khi gửi lên CSDL
    const englishStatus = convertStatusToEnglish(transactionStatus);
    
    const updatedOwner = {
      fullName,
      contact,
      address,
      transactionStatus: englishStatus,
      changeHistory,
    };

    try {
      const response = await axios.put(`http://localhost:8080/api/owners/${owner.id}`, updatedOwner);
      if (response.data) {
        onOwnerUpdated(); // Gọi lại hàm load danh sách chủ sở hữu sau khi cập nhật thành công
        onClose(); // Đóng modal
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật chủ sở hữu:", err);
      setError("Lỗi khi cập nhật chủ sở hữu.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Cập nhật Thông tin Chủ Sở Hữu</h2>
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
              Cập nhật
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

export default EditOwnerModal;
