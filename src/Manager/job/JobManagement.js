// src/job/JobManagement.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import AddJobModal from "./AddJobModal";   // Component modal thêm công việc (tùy chọn)
import EditJobModal from "./EditJobModal";   // Component modal sửa công việc (tùy chọn)
import JobDetailModal from "./JobDetailModal";
import "./JobManagement.css";

function JobManagement() {
  const [jobs, setJobs] = useState([]);
  const [lands, setLands] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [employees, setEmployees] = useState([]); // Danh sách nhân viên
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [detailJob, setDetailJob] =useState(null)
  const jobsPerPage = 5; // Số lượng bản ghi hiển thị trên mỗi trang

  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch đồng thời jobs, lands, jobTypes và employees
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [jobsRes, landsRes, jobTypesRes, employeesRes] = await Promise.all([
        axios.get("http://localhost:8080/api/jobs"),
        axios.get("http://localhost:8080/api/lands"),
        axios.get("http://localhost:8080/api/jobtypes"),
        axios.get("http://localhost:8080/api/users"), // Địa chỉ endpoint của UsersController
      ]);

      const jobsData = Array.isArray(jobsRes.data) ? jobsRes.data : [];
      const landsData = Array.isArray(landsRes.data) ? landsRes.data : [];
      const jobTypesData = Array.isArray(jobTypesRes.data) ? jobTypesRes.data : [];
      const employeesData = Array.isArray(employeesRes.data) ? employeesRes.data : [];

      setJobs(jobsData);
      setLands(landsData);
      setJobTypes(jobTypesData);
      setEmployees(employeesData);
      setError("");
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setError("Không thể tải dữ liệu. Hãy kiểm tra API.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (job) => {
    setEditJob(job);
  };

  const handleAdd = () => {
    setShowAddForm(true);
  };

  // Hàm trợ giúp: Lấy tên của đất theo landId (sử dụng thuộc tính location)
  const getLandName = (landId) => {
    const land = lands.find((l) => l.id === landId);
    return land ? land.location : landId;
  };

  // Hàm trợ giúp: Lấy tên của job type theo jobTypeId
  const getJobTypeName = (jobTypeId) => {
    const jobType = jobTypes.find((jt) => jt.id === jobTypeId);
    return jobType ? jobType.name : jobTypeId;
  };

  // Hàm trợ giúp: Lấy tên của nhân viên theo assignedTo (ID) dựa trên thuộc tính fullName
  const getEmployeeName = (employeeId) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    return employee ? employee.fullName : employeeId;
  };

  // Hàm chuyển đổi trạng thái từ tiếng Anh sang tiếng Việt
  const getVietnameseStatus = (status) => {
    const normalized = status.replace("_", " ").trim().toLowerCase();
    if (normalized === "in progress") return "Đang tiến hành";
    if (normalized === "paused") return "Tạm dừng";
    if (normalized === "completed") return "Hoàn thành";
    return status;
  };

  // Hàm xử lý tạm dừng hoặc làm lại công việc (nếu chưa hoàn thành)
  const handleTogglePauseResume = async (job) => {
    const normalizedStatus = job.status.replace("_", " ").trim().toLowerCase();
    if (normalizedStatus === "completed") {
      alert("Công việc đã hoàn thành, không thể chuyển trạng thái.");
      return;
    }
    let confirmMsg = "";
    let newStatus = "";
    console.log("Trạng thái hiện tại của job:", job.status);

    if (normalizedStatus === "in progress") {
      confirmMsg = "Bạn có chắc chắn muốn tạm dừng công việc này?";
      newStatus = "Paused";
    } else if (normalizedStatus === "paused") {
      confirmMsg = "Bạn có chắc chắn muốn làm lại công việc này?";
      newStatus = "In progress";
    } else {
      console.log("Không xử lý cho trạng thái:", normalizedStatus);
      return;
    }

    if (window.confirm(confirmMsg)) {
      try {
        const updatedJob = { ...job, status: newStatus };
        await axios.put(`http://localhost:8080/api/jobs/${job.id}`, updatedJob);
        setJobs(jobs.map((j) => (j.id === job.id ? updatedJob : j)));
      } catch (err) {
        console.error("Lỗi khi cập nhật trạng thái công việc:", err);
        alert("Không thể cập nhật trạng thái công việc.");
      }
    }
  };

  // Hàm xử lý hoàn thành công việc (chỉ áp dụng nếu chưa hoàn thành)
  const handleCompleteJob = async (job) => {
    const normalizedStatus = job.status.replace("_", " ").trim().toLowerCase();
    if (normalizedStatus === "completed") {
      alert("Công việc đã hoàn thành.");
      return;
    }
    if (window.confirm("Bạn có chắc chắn muốn hoàn thành công việc này?")) {
      try {
        const updatedJob = { ...job, status: "Completed" };
        await axios.put(`http://localhost:8080/api/jobs/${job.id}`, updatedJob);
        setJobs(jobs.map((j) => (j.id === job.id ? updatedJob : j)));
      } catch (err) {
        console.error("Lỗi khi hoàn thành công việc:", err);
        alert("Không thể hoàn thành công việc.");
      }
    }
  };

  // Phân trang dữ liệu
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  return (
    <div className="job-management">
      <div className="header-section">
        <h2>Quản lý Công Việc</h2>
        <button className="add-job-button" onClick={handleAdd}>
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
          <table className="job-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Đất</th>
                <th>Loại Công Việc</th>
                <th>Trạng Thái</th>
                <th>Phân Công</th>
                <th>Mô Tả</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
  {currentJobs.map((job) => {
    const normalizedStatus = job.status.replace("_", " ").trim().toLowerCase();
    let rowClass = "";
    if (normalizedStatus === "paused") {
      rowClass = "paused-job";
    } else if (normalizedStatus === "completed") {
      rowClass = "completed-job";
    }
    return (
      <tr key={job.id} className={rowClass} onClick={() => setDetailJob(job)} style={{ cursor: "pointer" }}>
        <td>{job.id}</td>
        <td>{getLandName(job.landId)}</td>
        <td>{getJobTypeName(job.jobTypeId)}</td>
        <td>{getVietnameseStatus(job.status)}</td>
        <td>{getEmployeeName(job.assignedTo)}</td>
        <td>{job.description}</td>
        <td>
          <div className="action-buttons">
            <button className="edit-button" onClick={(e) => { e.stopPropagation(); handleEdit(job); }}>
              👁️
            </button>
            {normalizedStatus !== "completed" && (
              <>
                <button className="pause-resume-button" onClick={(e) => { e.stopPropagation(); handleTogglePauseResume(job); }}>
                  {normalizedStatus === "in progress" ? "⏸️" : normalizedStatus === "paused" ? "▶️" : ""}
                </button>
                {normalizedStatus === "in progress" && (
                  <button className="complete-button" onClick={(e) => { e.stopPropagation(); handleCompleteJob(job); }}>
                    ✅
                  </button>
                )}
              </>
            )}
          </div>
        </td>
      </tr>
    );
  })}
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

      {/* Hiển thị modal thêm công việc */}
      {showAddForm && (
        <AddJobModal onClose={() => setShowAddForm(false)} onJobAdded={fetchAllData} />
      )}

      {/* Hiển thị modal sửa công việc */}
      {editJob && (
        <EditJobModal job={editJob} onClose={() => setEditJob(null)} onJobUpdated={fetchAllData} />
      )}
      {/* Hiển thị modal sửa công việc */}
      {detailJob && (
  <JobDetailModal job={detailJob} onClose={() => setDetailJob(null)} onJobUpdated={fetchAllData} />
)}
    </div>
  );
}

export default JobManagement;
