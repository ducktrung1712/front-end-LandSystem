import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Task.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState({}); // Lưu danh sách user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [reportData, setReportData] = useState({
    reportName: "",
    reportDate: new Date().toISOString().split("T")[0],
    content: "",
    image: null,
    analysisData: "", // Thêm trường phân tích dữ liệu
  });
  const [message, setMessage] = useState(""); // Thông báo kết quả gửi báo cáo
  const [submitting, setSubmitting] = useState(false); // Trạng thái đang gửi báo cáo

  // Lấy userId từ localStorage một lần và sử dụng xuyên suốt component
  const userId = localStorage.getItem("userId") || "";

  // Hàm chuyển đổi trạng thái từ tiếng Anh sang tiếng Việt
  const getVietnameseStatus = (status) => {
    const normalized = status.replace("_", " ").trim().toLowerCase();
    if (normalized === "in progress") return "Đang tiến hành";
    if (normalized === "paused") return "Tạm dừng";
    if (normalized === "completed") return "Hoàn thành";
    return status;
  };

  useEffect(() => {
    if (!userId) {
      setError("Không tìm thấy User ID");
      setLoading(false);
      return;
    }

    const fetchJobsAndUsers = async () => {
      try {
        // Lấy danh sách công việc
        const jobResponse = await axios.get(
          `http://localhost:8080/api/jobs/by-user/${userId}`,
          { timeout: 10000 }
        );
        
        // Lọc các công việc không có trạng thái "completed" hoặc "Hoàn thành"
        const filteredTasks = jobResponse.data.filter(task => {
          const status = task.status.toLowerCase();
          return !status.includes("completed") && !status.includes("complete") && !status.includes("hoàn thành");
        });
        
        setTasks(filteredTasks);

        // Lấy danh sách người dùng
        const userResponse = await axios.get("http://localhost:8080/api/users");
        const usersMap = userResponse.data.reduce((map, user) => {
          map[user.id] = user.fullName; // Giả sử API trả về user.id và user.fullName
          return map;
        }, {});
        setUsers(usersMap);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobsAndUsers();
  }, [userId]);

  const handleReportClick = (task) => {
    setSelectedTask(task);
    setReportData({
      reportName: `Báo cáo về ${task.jobTypeName || 'công việc'} tại ${task.landLocation || 'địa điểm'}`,
      reportDate: new Date().toISOString().split("T")[0],
      content: "",
      image: null,
      analysisData: "", // Khởi tạo trống
    });
    setShowReportForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData({ ...reportData, [name]: value });
  };

  const handleFileChange = (e) => {
    setReportData({ ...reportData, image: e.target.files[0] });
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    // Kiểm tra dữ liệu nhập vào
    if (!reportData.content.trim()) {
      setMessage("Vui lòng nhập nội dung báo cáo");
      setSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("reportName", reportData.reportName);
      formData.append("content", reportData.content);
      formData.append("jobId", selectedTask.id); // Sử dụng selectedTask để lấy jobId
      formData.append("landId", selectedTask.landId); // Sử dụng selectedTask để lấy landId
      formData.append("createdBy", userId); // Luôn dùng userId của người đăng nhập
      
      // Thêm dữ liệu phân tích nếu có
      if (reportData.analysisData.trim()) {
        formData.append("analysisData", reportData.analysisData);
      }
      
      // Thêm hình ảnh nếu có
      if (reportData.image) {
        formData.append("image", reportData.image);
      }

      const response = await axios.post("http://localhost:8080/api/reports", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Báo cáo đã được tạo:", response.data);
      setMessage("Báo cáo đã được gửi thành công!");
      
      // Đặt timeout để hiển thị thông báo thành công trước khi quay lại danh sách
      setTimeout(() => {
        setShowReportForm(false);
        // Reset form data
        setReportData({
          reportName: "",
          reportDate: new Date().toISOString().split("T")[0],
          content: "",
          image: null,
          analysisData: "",
        });
        setSelectedTask(null);
      }, 2000);
      
    } catch (error) {
      console.error("Lỗi khi gửi báo cáo:", error);
      setMessage("Đã xảy ra lỗi khi gửi báo cáo. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="task-list-container">
      {!showReportForm ? (
        <>
          <h2 className="task-list-title">Danh sách công việc</h2>
          {message && <p className="success-message">{message}</p>}
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : tasks.length === 0 ? (
            <p>Không có công việc nào đang tiến hành.</p>
          ) : (
            <table className="task-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Loại công việc</th>
                  <th>Địa điểm</th>
                  <th>Người thực hiện</th>
                  <th>Trạng thái</th>
                  <th>Mô tả</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.id}</td>
                    <td>{task.jobTypeName}</td>
                    <td>{task.landLocation}</td>
                    <td>{users[task.assignedTo] || "Không rõ"}</td>
                    <td>{getVietnameseStatus(task.status)}</td>
                    <td>{task.description}</td>
                    <td>
                      <button
                        className="report-button"
                        onClick={() => handleReportClick(task)}
                      >
                        Báo cáo
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      ) : (
        <div className="report-form">
          <h2 className="task-list-title">Tạo Báo Cáo</h2>
          {message && (
            <p className={message.includes("thành công") ? "success-message" : "error-message"}>
              {message}
            </p>
          )}
          <form onSubmit={handleSubmitReport}>
            <div className="form-group">
              <label>Tên báo cáo:</label>
              <input 
                type="text" 
                name="reportName"
                value={reportData.reportName} 
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Ngày viết báo cáo:</label>
              <input 
                type="date" 
                name="reportDate"
                value={reportData.reportDate} 
                readOnly 
              />
            </div>

            <div className="form-group">
              <label>Người tạo báo cáo:</label>
              <input 
                type="text"
                value={users[userId] || userId || "Người dùng hiện tại"} 
                readOnly 
              />
            </div>

            <div className="form-group">
              <label>Nội dung báo cáo: <span className="required">*</span></label>
              <textarea
                name="content"
                value={reportData.content}
                onChange={handleInputChange}
                required
                placeholder="Mô tả chi tiết về công việc đã thực hiện, các vấn đề gặp phải, và kết quả đạt được..."
              ></textarea>
            </div>

            <div className="form-group">
              <label>Phân tích dữ liệu:</label>
              <textarea
                name="analysisData"
                value={reportData.analysisData}
                onChange={handleInputChange}
                placeholder="Nhập các số liệu phân tích, đánh giá hoặc các thông tin kỹ thuật khác (nếu có)..."
              ></textarea>
            </div>

            <div className="form-group">
              <label>Hình ảnh:</label>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                accept="image/*"
              />
              <small>Hình ảnh minh họa cho báo cáo (nếu có)</small>
            </div>

            <div className="button-group">
              <button 
                type="submit" 
                className="submit-button"
                disabled={submitting}
              >
                {submitting ? "Đang gửi..." : "Gửi báo cáo"}
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowReportForm(false)}
                disabled={submitting}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TaskList;