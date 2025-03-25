import React, { useState, useEffect } from "react";
import axios from "axios";
import AddLandModal from "./AddLandModal";
import EditLandModal from "./EditLandModal";
import "./LandManagement.css";


function LandManagement() {
  const [lands, setLands] = useState([]);
  const [owners, setOwners] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editLand, setEditLand] = useState(null);
  const landsPerPage = 5;

  useEffect(() => {
    fetchLands();
    fetchOwners();
    fetchAreas();
  }, []);
  
  useEffect(() => {
    console.log("Dữ liệu đất:", lands);
  }, [lands]);
  

  const fetchLands = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/lands");
      if (Array.isArray(response.data)) {
        setLands(response.data);
      } else {
        throw new Error("Dữ liệu API không hợp lệ.");
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách đất:", err);
      setError("Không thể tải dữ liệu đất. Vui lòng kiểm tra API.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOwners = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/owners");
      console.log("Dữ liệu chủ sở hữu:", response.data);
      if (Array.isArray(response.data)) {
        setOwners(response.data);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách chủ sở hữu:", err);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/areas");
      console.log("Dữ liệu khu vực:", response.data);
      if (Array.isArray(response.data)) {
        setAreas(response.data);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách khu vực:", err);
    }
  };

  const getOwnerName = (owner) => {
    if (!owner) return "Chưa có chủ sở hữu";
    const foundOwner = owners.find((o) => o.id === owner.id);
    return foundOwner ? foundOwner.fullName : "Chưa có chủ sở hữu";
};

const getAreaName = (area) => {
    if (!area) return "Chưa có khu vực";
    const foundArea = areas.find((a) => a.id === area.id);
    return foundArea ? foundArea.name : "Chưa có khu vực";
};


  const statusMapping = {
    "Unused": "Chưa sử dụng",
    "In use": "Đang sử dụng",
    "Needs inspection": "Cần kiểm tra",
    "Sold":"Đã Bán"
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/lands/${id}`);
      setLands(lands.filter((land) => land.id !== id));
    } catch (err) {
      console.error("Lỗi khi xoá đất:", err);
      alert("Không thể xoá đất.");
    }
  };

  const handleEdit = (land) => {
    setEditLand(land);
  };

  const handleAdd = () => {
    setShowAddForm(true);
  };

  const indexOfLastLand = currentPage * landsPerPage;
  const indexOfFirstLand = indexOfLastLand - landsPerPage;
  const currentLands = lands.slice(indexOfFirstLand, indexOfLastLand);
  const totalPages = Math.ceil(lands.length / landsPerPage);

  return (
    <div className="land-management">
      <div className="header-section">
        <h2>Quản lý đất đai</h2>
        <button className="add-land-button" onClick={handleAdd}>
          + Thêm mới
        </button>
      </div>

      {loading && <div className="loading">Đang tải...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <div className="table-container">
          <table className="land-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Khu vực</th>
                <th>Chủ sở hữu</th>
                <th>Diện tích</th>
                <th>Vị trí</th>
                <th>Trạng thái</th>
                <th>Loại đất</th>
                <th>Hình ảnh</th>
                <th>Mô tả</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentLands.map((land) => (
                <tr key={land.id}>
                  <td>{land.id}</td>
                  <td>{getAreaName(land.area)}</td>
                  <td>{getOwnerName(land.owner)}</td>
                  <td>{land.areaSize} m²</td>
                  <td>{land.location}</td>
                  <td>{statusMapping[land.status] || land.status}</td>
                  <td>{land.landType}</td>
                  <td>
                    {land.image ? (
                      <img
                        src={`data:image/jpeg;base64,${land.image}`}
                        alt="Hình đất"
                        className="land-image"
                      />
                    ) : (
                      "Không có ảnh"
                    )}
                  </td>
                  <td>{land.description}</td>
                  <td style={{ display: "flex"}}>
                    <button className="edit-button" onClick={() => handleEdit(land)}>✏️</button>
                    <button className="delete-button" onClick={() => handleDelete(land.id)}>🗑️</button>
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

      {showAddForm && <AddLandModal onClose={() => setShowAddForm(false)} onLandAdded={fetchLands} />}
      {editLand && <EditLandModal land={editLand} onClose={() => setEditLand(null)} onLandUpdated={fetchLands} />}
    </div>
  );
}

export default LandManagement;