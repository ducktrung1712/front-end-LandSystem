import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Task.css";


const tasks = [
  {
    id: 1,
    group_id: 101,
    title: "Sửa chữa đèn đường khu vực 11",
    task_type: "Xử lý sự cố",
    assigned_to: "Nguyễn Văn A",
    deadline: "2025-03-10",
    start_date: "2025-02-20",
    end_date: null,
    description: "Sửa chữa mmột số đèn đường bị hỏng"
  },
  {
    id: 2,
    group_id: 102,
    title: "Kiểm tra hạ tầng khu vực 11",
    task_type: "Kiểm tra",
    assigned_to: "Trần Thị B",
    deadline: "2025-03-15",
    start_date: "2025-02-22",
    end_date: null,
    description: "Kiển tra cơ sở vật chất và hạ tầng"
  }
];

const TaskList = () => {
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportData, setReportData] = useState({
    reportName: "",
    reportDate: "",
    reporter: "",
    content: "",
    image: ""
  });

  const handleReportClick = () => {
    setShowReportForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData({ ...reportData, [name]: value });
  };

  return (
    <div className="task-list-container">
      {!showReportForm ? (
        <>
          <h2 className="task-list-title">Danh sách công việc</h2>
          <table className="task-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nhiệm vụ</th>
                <th>Loại</th>
                <th>Người thực hiện</th>
                <th>Hạn chót</th>
                <th>Ghi chú</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.title}</td>
                  <td>{task.task_type}</td>
                  <td>{task.assigned_to}</td>
                  <td>{task.deadline}</td>
                  <td>{task.description}</td>
                  <td><button className="report-button" onClick={handleReportClick}>Báo cáo</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="report-form">
          <h2 className="task-list-title">Tạo Báo Cáo</h2>
          <label>Tên báo cáo:</label>
          <input type="text" name="reportName" value={reportData.reportName} onChange={handleInputChange} />
          
          <label>Ngày viết báo cáo:</label>
          <input type="date" name="reportDate" value={reportData.reportDate} onChange={handleInputChange} />
          
          <label>Người tạo:</label>
          <input type="text" name="reporter" value={reportData.reporter} onChange={handleInputChange} />
          
          <label>Nội dung báo cáo:</label>
          <textarea name="content" value={reportData.content} onChange={handleInputChange}></textarea>
          
          <label>Hình ảnh:</label>
          <input type="file" name="image" onChange={handleInputChange} />
          
          <button className="report-button" onClick={() => setShowReportForm(false)}>Gửi báo cáo</button>
        </div>
      )}
    </div>
  );
};

export default TaskList;
