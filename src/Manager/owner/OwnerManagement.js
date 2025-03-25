import React, { useState, useEffect } from "react";
import axios from "axios";
import AddOwnerModal from "./AddOwnerModal";   // Component modal thêm chủ sở hữu
import EditOwnerModal from "./EditOwnerModal";   // Component modal sửa chủ sở hữu
import "./OwnerManagement.css";

function OwnerManagement() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editOwner, setEditOwner] = useState(null);
  const ownersPerPage = 7; // Số lượng bản ghi hiển thị trên mỗi trang

  useEffect(() => {
    fetchOwners();
  }, []);

  // Lấy danh sách chủ sở hữu từ API
  const fetchOwners = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/owners");
      if (Array.isArray(response.data)) {
        setOwners(response.data);
      } else {
        throw new Error("API trả về dữ liệu không hợp lệ.");
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách chủ sở hữu:", err);
      setError("Không thể tải dữ liệu chủ sở hữu. Hãy kiểm tra API.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý hiển thị modal sửa thông tin chủ sở hữu
  const handleEdit = (owner) => {
    setEditOwner(owner);
  };

  // Hàm xử lý hiển thị modal thêm mới chủ sở hữu
  const handleAdd = () => {
    setShowAddForm(true);
  };

  // Phân trang dữ liệu
  const indexOfLastOwner = currentPage * ownersPerPage;
  const indexOfFirstOwner = indexOfLastOwner - ownersPerPage;
  const currentOwners = owners.slice(indexOfFirstOwner, indexOfLastOwner);
  const totalPages = Math.ceil(owners.length / ownersPerPage);

  // Hàm chuyển đổi giá trị trạng thái giao dịch sang tiếng Việt
  const convertTransactionStatus = (status) => {
    if (status === "Owned") return "Sở hữu";
    if (status === "Transferred") return "Chuyển giao";
    return status;
  };

  return (
    <div className="owner-management">
      <div className="header-section">
        <h2>Quản lý chủ sở hữu</h2>
        <button className="add-owner-button" onClick={handleAdd}>
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
          <table className="owner-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Họ và tên</th>
                <th>Liên hệ</th>
                <th>Địa chỉ</th>
                <th>Trạng thái giao dịch</th>
                <th>Lịch sử thay đổi</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentOwners.map((owner) => (
                <tr key={owner.id}>
                  <td>{owner.id}</td>
                  <td>{owner.fullName}</td>
                  <td>{owner.contact}</td>
                  <td>{owner.address}</td>
                  <td>{convertTransactionStatus(owner.transactionStatus)}</td>
                  <td>{owner.changeHistory}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(owner)}
                      >
                        ✏️
                      </button>
                      {/* Nút xoá đã bị loại bỏ */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phân trang */}
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

      {/* Hiển thị modal thêm chủ sở hữu */}
      {showAddForm && (
        <AddOwnerModal
          onClose={() => setShowAddForm(false)}
          onOwnerAdded={fetchOwners}
        />
      )}

      {/* Hiển thị modal sửa chủ sở hữu */}
      {editOwner && (
        <EditOwnerModal
          owner={editOwner}
          onClose={() => setEditOwner(null)}
          onOwnerUpdated={fetchOwners}
        />
      )}
    </div>
  );
}

export default OwnerManagement;
