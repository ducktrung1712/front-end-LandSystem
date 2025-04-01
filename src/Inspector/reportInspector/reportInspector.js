import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Report.css";

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setError("Không tìm thấy User ID");
      setLoading(false);
      return;
    }

    const fetchReports = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/reports/by-user/${userId}`,
          { timeout: 10000 } // Tăng timeout lên 10s để tránh request bị gián đoạn
        );
        console.log("Dữ liệu từ API:", response.data);
        setReports(response.data);
      } catch (error) {
        if (error.response) {
          console.error("Lỗi từ server:", error.response.status, error.response.data);
          setError(`Lỗi từ server: ${error.response.status}`);
        } else if (error.request) {
          console.error("Lỗi mạng hoặc server không phản hồi:", error.request);
          setError("Lỗi mạng hoặc server không phản hồi");
        } else {
          console.error("Lỗi khi tạo request:", error.message);
          setError("Lỗi khi tạo request");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [userId]);

  return (
    <div className="report-container">
      <h2 className="report-title">Danh sách Báo Cáo Của Bạn</h2>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : reports.length === 0 ? (
        <p>Không có báo cáo nào.</p>
      ) : (
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
                <td>{report.createdByFullName}</td>
                <td>{report.content}</td>
                <td>
                  {report.image ? (
                    <img
                      src={`data:image/jpeg;base64,${report.image}`}
                      alt="Report"
                      className="report-image"
                    />
                  ) : (
                    <span>Không có ảnh</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReportPage;