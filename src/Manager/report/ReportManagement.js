import React, { useState, useEffect } from "react";
import "./ReportManagement.css";
import { Table, Button, Input, Select, message } from "antd";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import axios from "axios";

const { Option } = Select;

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jobTypes, setJobTypes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedJob, setSelectedJob] = useState("all");

  useEffect(() => {
    fetchReports();
    fetchJobTypes();
  }, [selectedJob]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      let url = "http://localhost:8080/api/reports";
      if (selectedJob !== "all") {
        url += `?jobTypeName=${selectedJob}`;
      }
      const response = await axios.get(url);
      setReports(response.data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách báo cáo");
    }
    setLoading(false);
  };

  const fetchJobTypes = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/jobtypes");
      setJobTypes(response.data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách công việc");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/reports/${id}`);
      setReports(reports.filter((report) => report.id !== id));
      message.success("Xóa báo cáo thành công");
    } catch (error) {
      message.error("Lỗi khi xóa báo cáo");
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleFilter = (value) => {
    setSelectedJob(value);
  };

  const filteredReports = reports.filter((report) => {
    return (
      report.reportName.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const columns = [
    { title: "Tên báo cáo", dataIndex: "reportName", key: "reportName" },
    { title: "Ngày tạo", dataIndex: "creationDate", key: "creationDate" },
    { title: "Người tạo", dataIndex: ["createdBy", "username"], key: "createdBy" },
    {
      title: "Hành động",
      key: "actions",
      render: (record) => (
        <Button type="danger" onClick={() => handleDelete(record.id)}>
          Xóa
        </Button>
      ),
    },
  ];

  const pieData = filteredReports.reduce((acc, report) => {
    const job = report.job || "Khác";
    const existing = acc.find((item) => item.name === job);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: job, value: 1 });
    }
    return acc;
  }, []);

  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="report-container">
      <h2>Quản lý Báo cáo</h2>
      
      {/* Bộ lọc */}
      <div className="filters">
        <Input
          placeholder="Tìm kiếm báo cáo"
          style={{ width: 200, marginRight: 10 }}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Select
          placeholder="Chọn công việc"
          style={{ width: 150 }}
          onChange={handleFilter}
        >
          <Option value="all">Tất cả</Option>
          {jobTypes.map((job) => (
            <Option key={job.id} value={job.name}>{job.name}</Option>
          ))}
        </Select>
      </div>

      {/* Bảng danh sách báo cáo */}
      <Table dataSource={filteredReports} columns={columns} rowKey="id" loading={loading} />

      {/* Biểu đồ thống kê */}
      <h3>Thống kê báo cáo theo công việc</h3>
      <PieChart width={300} height={300}>
        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
          {pieData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default ReportManagement;
