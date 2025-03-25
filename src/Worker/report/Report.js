import React, { useState, useEffect } from "react";
import "./Report.css";

const ReportPage = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Giả lập fetch dữ liệu từ API hoặc database
    const fetchedReports = [
      {
        id: 1,
        reportName: "Báo cáo sự cố đèn đường khu 11",
        reportDate: "2025-03-01",
        reporter: "Nguyễn Văn A",
        content: "Sự cố đèn đường đã được khắc phục sau khi thay thế bóng đèn.",
        image: "network-issue.jpg"
      },
      {
        id: 2,
        reportName: "Báo cáo kiểm tra hạ tầng khu 11",
        reportDate: "2025-03-05",
        reporter: "Trần Thị B",
        content: "Hạ tầng khu 11 không bị sao.",
        image: "software-update.jpg"
      }
    ];
    setReports(fetchedReports);
  }, []);

  return (
    <div className="report-container">
      <h2 className="report-title">Danh sách Báo Cáo</h2>
      <table className="report-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên báo cáo</th>
            <th>Ngày viết</th>
            <th>Người tạo</th>
            <th>Nội dung</th>
            <th>Hình ảnh</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.id}</td>
              <td>{report.reportName}</td>
              <td>{report.reportDate}</td>
              <td>{report.reporter}</td>
              <td>{report.content}</td>
              <td>
                {report.image && <img src={report.image} alt="Report" className="report-image" />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportPage;
