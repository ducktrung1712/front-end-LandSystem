// src/job/AddJobModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddJobModal.css';

const AddJobModal = ({ onClose, onJobAdded }) => {
  // State cho form
  const [landId, setLandId] = useState('');
  const [jobTypeId, setJobTypeId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [description, setDescription] = useState('');
  const [lands, setLands] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [employees, setEmployees] = useState([]); // Danh sách nhân viên
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dữ liệu: đất, loại công việc, nhân viên
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [landsRes, jobTypesRes, employeesRes] = await Promise.all([
          axios.get('http://localhost:8080/api/lands'),
          axios.get('http://localhost:8080/api/jobtypes'),
          axios.get('http://localhost:8080/api/users'), // Endpoint từ UsersController
        ]);
        setLands(Array.isArray(landsRes.data) ? landsRes.data : []);
        setJobTypes(Array.isArray(jobTypesRes.data) ? jobTypesRes.data : []);
        setEmployees(Array.isArray(employeesRes.data) ? employeesRes.data : []);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Lỗi khi tải dữ liệu.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  // Submit form: gửi dữ liệu dưới dạng JSON
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (!landId || !jobTypeId || !assignedTo || !description) {
      setError("Vui lòng nhập đầy đủ các thông tin cần thiết.");
      return;
    }

    const newJob = {
      landId: parseInt(landId, 10),
      jobTypeId: parseInt(jobTypeId, 10),
      status: "In progress", // Luôn là "In progress"
      assignedTo: parseInt(assignedTo, 10),
      description,
      image: null, // Nếu chưa xử lý upload ảnh, đặt là null
    };

    try {
      await axios.post('http://localhost:8080/api/jobs', newJob, {
        headers: { 'Content-Type': 'application/json' }
      });
      onJobAdded();
      onClose();
    } catch (err) {
      console.error("Lỗi khi thêm công việc:", err);
      setError("Lỗi khi thêm công việc. Vui lòng thử lại.");
    }
  };

  const selectedLand = lands.find((land) => land.id === parseInt(landId, 10));

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Thêm Công Việc Mới</h2>
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Chọn Đất:</label>
              <select value={landId} onChange={(e) => setLandId(e.target.value)} required>
                <option value="">-- Chọn Đất --</option>
                {lands.map((land) => (
                  <option key={land.id} value={land.id}>
                    {land.location}
                  </option>
                ))}
              </select>
            </div>
            {landId && selectedLand && (
              <div className="form-group">
                <label>Địa điểm:</label>
                <input type="text" value={selectedLand.location} readOnly />
              </div>
            )}
            <div className="form-group">
              <label>Chọn Loại Công Việc:</label>
              <select value={jobTypeId} onChange={(e) => setJobTypeId(e.target.value)} required>
                <option value="">-- Chọn Loại Công Việc --</option>
                {jobTypes.map((jobType) => (
                  <option key={jobType.id} value={jobType.id}>
                    {jobType.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Phân Công (Chọn Nhân Viên):</label>
              <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required>
                <option value="">-- Chọn Nhân Viên --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Mô Tả:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả công việc"
                required
              />
            </div>
            <div className="form-group button-group">
              <button type="submit">Thêm Công Việc</button>
              <button type="button" onClick={onClose}>Hủy</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddJobModal;
