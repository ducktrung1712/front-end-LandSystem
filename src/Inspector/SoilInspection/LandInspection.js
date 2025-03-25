import React, { useState, useEffect } from "react";
import "./LandInspection.css";
import axios from "axios";

function LandInspection() {
  const [lands, setLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/lands")
      .then((response) => setLands(response.data))
      .catch((error) => console.error("Lỗi tải dữ liệu:", error));
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const statusMapping = {
    "Unused": "Chưa sử dụng",
    "In use": "Đang sử dụng",
    "Needs inspection": "Cần kiểm tra",
    "Sold":"Đã Bán"
  };
  const filteredLands = lands.filter((land) =>
    land.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="inspection-container">
      <h2>Kiểm Tra Đất</h2>
      <input
        type="text"
        placeholder="Tìm kiếm theo vị trí..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-box"
      />
      <div className="land-list">
        {filteredLands.map((land) => (
          <div
            key={land.id}
            className="land-item"
            onClick={() => setSelectedLand(land)}
          >
            <h3>{land.location}</h3>
            <p>Loại đất: {land.landType}</p>
            <p>Diện tích: {land.areaSize} m²</p>
            <p>Trạng thái: {statusMapping[land.status] || land.status}</p>
          </div>
        ))}
      </div>
      {selectedLand && (
        <div className="land-details">
          <h3>Chi tiết lô đất</h3>
          <p><strong>Vị trí:</strong> {selectedLand.location}</p>
          <p><strong>Chủ sở hữu:</strong> {selectedLand.owner?.fullName || "Chưa có"}</p>
          <p><strong>Diện tích:</strong> {selectedLand.areaSize} m²</p>
          <p><strong>Loại đất:</strong> {selectedLand.landType}</p>
          <p><strong>Trạng thái:</strong> {statusMapping[selectedLand.status] || selectedLand.status}</p>
          <p><strong>Mô tả:</strong> {selectedLand.description || "Không có mô tả"}</p>
          <button onClick={() => setSelectedLand(null)}>Đóng</button>
        </div>
      )}
    </div>
  );
}

export default LandInspection;
