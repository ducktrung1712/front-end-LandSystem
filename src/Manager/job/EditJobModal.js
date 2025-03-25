// src/job/EditJobModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddJobModal.css';

const EditJobModal = ({ job, onClose, onJobUpdated }) => {
  // Khởi tạo state với giá trị từ job
  const [landId, setLandId] = useState(job.landId.toString());
  const [jobTypeId, setJobTypeId] = useState(job.jobTypeId.toString());
  const [assignedTo, setAssignedTo] = useState(job.assignedTo ? job.assignedTo.toString() : '');
  const [description, setDescription] = useState(job.description);
  const [image, setImage] = useState(null); // Nếu người dùng muốn thay đổi ảnh
  const [lands, setLands] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dữ liệu: đất, loại công việc và nhân viên
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [landsRes, jobTypesRes, employeesRes] = await Promise.all([
          axios.get('http://localhost:8080/api/lands'),
          axios.get('http://localhost:8080/api/jobtypes'),
          axios.get('http://localhost:8080/api/users'),
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

  // Nếu bạn không xử lý ảnh, bạn có thể bỏ qua input file. Nếu cần, bạn có thể giữ lại.
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Khi submit, chúng ta gửi dữ liệu dưới dạng JSON.
  // Nếu backend chỉ xử lý JSON (với @RequestBody Job job) thì gửi JSON.
  // Nếu cần upload ảnh, backend phải được cấu hình để nhận multipart.
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedJob = {
      ...job,
      landId: parseInt(landId, 10),
      jobTypeId: parseInt(jobTypeId, 10),
      assignedTo: parseInt(assignedTo, 10),
      description,
      image: null // Nếu không cập nhật ảnh, hoặc xử lý theo logic khác
    };

    try {
      await axios.put(`http://localhost:8080/api/jobs/${job.id}`, updatedJob, {
        headers: { 'Content-Type': 'application/json' }
      });
      onJobUpdated();
      onClose();
    } catch (err) {
      console.error("Lỗi khi cập nhật công việc:", err);
      setError("Lỗi khi cập nhật công việc. Vui lòng thử lại.");
    }
  };

  const selectedLand = lands.find((land) => land.id === parseInt(landId, 10));

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Sửa Công Việc</h2>
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
            <div className="form-group">
              <label>Chọn Ảnh (Nếu cần thay đổi):</label>
              <input type="file" onChange={handleImageChange} accept="image/*" />
            </div>
            <div className="form-group button-group">
              <button type="submit">Lưu Thay Đổi</button>
              <button type="button" onClick={onClose}>Hủy</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditJobModal;
