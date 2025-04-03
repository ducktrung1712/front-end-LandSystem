import React, { useState, useEffect } from "react";
import "./ReportManagement.css";
import { Table, Button, Input, DatePicker, message, Spin, Modal, Popconfirm } from "antd";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import moment from "moment";
import axios from "axios";

const { RangePicker } = DatePicker;
const API_BASE_URL = "http://localhost:8080/api";

const ReportManagement = () => {
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);


  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/reports`);
      setReports(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Không thể tải dữ liệu báo cáo. Vui lòng thử lại sau.");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  // Fixed date filter function
  const handleDateFilter = (dates) => {
    if (dates && dates.length === 2) {
      // Store moment objects with start of day and end of day to include the entire date range
      setDateRange([dates[0].startOf('day'), dates[1].endOf('day')]);
    } else {
      setDateRange(null);
    }
  };

  // Sửa lại logic lọc ngày
const filteredReports = reports.filter((report) => {
  // Lọc theo văn bản
  const matchText = !searchText || 
    (report.reportName && report.reportName.toLowerCase().includes(searchText.toLowerCase()));
  
  // Lọc theo phạm vi ngày
  let matchDate = true;
  if (dateRange && dateRange.length === 2 && report.reportDate) {
    // Chuyển đổi chuỗi ngày từ dữ liệu thành đối tượng moment
    // Đảm bảo chỉ lấy phần ngày (YYYY-MM-DD) từ chuỗi để tránh vấn đề múi giờ
    const reportDateStr = report.reportDate.substring(0, 10);
    const reportDate = moment(reportDateStr, 'YYYY-MM-DD');
    
    // Chuyển đổi phạm vi ngày tìm kiếm sang cùng định dạng để so sánh
    const startDate = dateRange[0].format('YYYY-MM-DD');
    const endDate = dateRange[1].format('YYYY-MM-DD');
    
    // So sánh theo định dạng chuỗi để tránh vấn đề về múi giờ
    matchDate = reportDateStr >= startDate && reportDateStr <= endDate;
  }
  
  return matchText && matchDate;
});

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/reports/${id}`);
      message.success("Xóa báo cáo thành công");
      // Cập nhật danh sách báo cáo
      fetchReports();
    } catch (err) {
      console.error("Error deleting report:", err);
      message.error("Không thể xóa báo cáo. Vui lòng thử lại.");
    }
  };

  const handleViewReport = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/reports/${id}`);
      setSelectedReport(response.data);
      setViewModalVisible(true);
    } catch (err) {
      console.error("Error fetching report details:", err);
      message.error("Không thể tải chi tiết báo cáo. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseViewModal = () => {
    setViewModalVisible(false);
    setSelectedReport(null);
  };

  const columns = [
    { 
      title: "ID", 
      dataIndex: "id", 
      key: "id",
      width: 70 
    },
    { 
      title: "Tên báo cáo", 
      dataIndex: "reportName", 
      key: "reportName",
      render: (text, record) => (
        <a onClick={() => handleViewReport(record.id)}>{text}</a>
      )
    },
    { 
      title: "Ngày tạo", 
      dataIndex: "reportDate", 
      key: "reportDate",
      render: (date) => date ? moment(date).format('DD/MM/YYYY') : 'N/A'
    },
    { 
      title: "Người tạo", 
      dataIndex: "createdByFullName", 
      key: "createdBy",
      render: (text) => text || "Không xác định"
    },
    { 
      title: "Công việc", 
      dataIndex: "jobTypeName", 
      key: "jobTypeName",
      render: (text) => text || "Không xác định"
    },
    { 
      title: "Địa điểm", 
      dataIndex: "landLocation", 
      key: "landLocation",
      render: (text) => text || "Không xác định"
    },
    {
      title: "Hành động",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <div className="action-buttons">
          <Button 
            type="primary" 
            size="small" 
            onClick={() => handleViewReport(record.id)}
            style={{ marginRight: '5px' }}
          >
            Xem
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa báo cáo này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button 
              type="danger" 
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Tạo dữ liệu cho biểu đồ
  const pieData = filteredReports.reduce((acc, report) => {
    const job = report.jobTypeName || "Khác";
    const existing = acc.find((item) => item.name === job);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: job, value: 1 });
    }
    return acc;
  }, []);

  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

  return (
    <div className="report-container">
      <h2>Quản lý Báo cáo</h2>
      
      {/* Bộ lọc */}
      <div className="filters">
        <Input
          placeholder="Tìm kiếm theo tên, người tạo hoặc địa điểm"
          style={{ width: 300, marginRight: 10 }}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
        />
        <RangePicker 
          style={{ width: 250 }} 
          onChange={handleDateFilter}
          format="DD/MM/YYYY"
        />
        <Button 
          type="primary" 
          onClick={fetchReports} 
          style={{ marginLeft: 10 }}
        >
          Làm mới
        </Button>
      </div>

      {/* Hiển thị lỗi nếu có */}
      {error && <div className="error-message">{error}</div>}

      {/* Hiển thị loading hoặc bảng */}
      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          {/* Thêm thông tin về số lượng báo cáo */}
          <div className="filter-info">
            <p>Tìm thấy {filteredReports.length} báo cáo</p>
          </div>
          
          {/* Bảng danh sách báo cáo */}
          <Table 
            dataSource={filteredReports} 
            columns={columns} 
            rowKey="id"
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: "Không có dữ liệu báo cáo" }}
          />

          {/* Hiển thị biểu đồ chỉ khi có dữ liệu */}
          {filteredReports.length > 0 && (
            <div className="statistics-section">
              <h3>Thống kê báo cáo theo công việc</h3>
              <div className="chart-container">
                <ResponsiveContainer width={400} height={300}>
                  <PieChart>
                    <Pie 
                      data={pieData} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={100} 
                      fill="#8884d8"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} báo cáo`, 'Số lượng']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="chart-legend">
                  {pieData.map((entry, index) => (
                    <div key={`legend-${index}`} className="legend-item">
                      <div 
                        className="color-box" 
                        style={{ backgroundColor: colors[index % colors.length] }}
                      ></div>
                      <span>{entry.name}: {entry.value} báo cáo</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Modal hiển thị chi tiết báo cáo */}
          <Modal
            title={selectedReport ? `Chi tiết báo cáo: ${selectedReport.reportName}` : "Chi tiết báo cáo"}
            visible={viewModalVisible}
            onCancel={handleCloseViewModal}
            footer={[
              <Button key="close" onClick={handleCloseViewModal}>
                Đóng
              </Button>
            ]}
            width={800}
          >
            {selectedReport && (
              <div className="report-detail">
                <p><strong>Ngày tạo:</strong> {moment(selectedReport.reportDate).format('DD/MM/YYYY')}</p>
                <p><strong>Người tạo:</strong> {selectedReport.createdByFullName || "Không xác định"}</p>
                <p><strong>Loại công việc:</strong> {selectedReport.jobTypeName || "Không xác định"}</p>
                <p><strong>Địa điểm:</strong> {selectedReport.landLocation || "Không xác định"}</p>
                
                <div className="report-content">
                  <h4>Nội dung báo cáo:</h4>
                  <div dangerouslySetInnerHTML={{ __html: selectedReport.content }} />
                </div>
                
                {selectedReport.analysisData && (
                  <div className="analysis-data">
                    <h4>Dữ liệu phân tích:</h4>
                    <pre>{selectedReport.analysisData}</pre>
                  </div>
                )}
                
                {selectedReport.image && (
                  <div className="report-image">
                    <h4>Hình ảnh:</h4>
                    <img 
                      src={`data:image/jpeg;base64,${selectedReport.image}`} 
                      alt="Report image" 
                      style={{ maxWidth: '100%' }}
                    />
                  </div>
                )}
              </div>
            )}
          </Modal>
        </>
      )}
    </div>
  );
};

export default ReportManagement;