import React, { useState, useEffect } from "react";
import axios from "axios";
import AddAreaModal from "./AddAreaModal";   // Component modal thêm khu vực
import EditAreaModal from "./EditAreaModal"; // Component modal sửa khu vực
import "./AreaManagement.css";

function AreaManagement() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editArea, setEditArea] = useState(null);
  const areasPerPage = 4; // Số lượng bản ghi hiển thị trên mỗi trang

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/areas");
      if (Array.isArray(response.data)) {
        setAreas(response.data);
      } else {
        throw new Error("API trả về dữ liệu không hợp lệ.");
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách khu vực:", err);
      setError("Không thể tải dữ liệu khu vực. Hãy kiểm tra API.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/areas/${id}`);
      setAreas(areas.filter((area) => area.id !== id));
    } catch (err) {
      console.error("Lỗi khi xoá khu vực:", err);
      alert("Không thể xoá khu vực.");
    }
  };

  const handleEdit = (area) => {
    setEditArea(area);
  };

  const handleAdd = () => {
    setShowAddForm(true);
  };

  // Phân trang dữ liệu
  const indexOfLastArea = currentPage * areasPerPage;
  const indexOfFirstArea = indexOfLastArea - areasPerPage;
  const currentAreas = areas.slice(indexOfFirstArea, indexOfLastArea);
  const totalPages = Math.ceil(areas.length / areasPerPage);

  return (
    <div className="area-management">
      <div className="header-section">
        <h2>Quản lý khu vực</h2>
        <button className="add-area-button" onClick={handleAdd}>
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
          <table className="area-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tên khu vực</th>
                <th>Hình ảnh</th> 
                <th>Diện tích</th>
                <th>Loại đất ưu tiên</th>
                <th>Mô tả</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentAreas.map((area) => (
                <tr key={area.id}>
                  <td>{area.id}</td>
                  <td>{area.name}</td>
                  <td>
                    {area.image ? (
                      <img
                        src={`data:image/jpeg;base64,${area.image}`}
                        alt={area.name}
                        style={{ width: "100px", height: "auto" }}
                      />
                    ) : (
                      "Không có hình"
                    )}
                  </td>
                  <td>{area.totalArea}</td>
                  <td>{area.priorityLandType}</td>
                  <td>{area.description}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(area)}
                      >
                        ✏️
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(area.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

      {/* Hiển thị modal thêm khu vực */}
      {showAddForm && (
        <AddAreaModal
          onClose={() => setShowAddForm(false)}
          onAreaAdded={fetchAreas}
        />
      )}

      {/* Hiển thị modal sửa khu vực */}
      {editArea && (
        <EditAreaModal
          area={editArea}
          onClose={() => setEditArea(null)}
          onAreaUpdated={fetchAreas}
        />
      )}
    </div>
  );
}

export default AreaManagement;
