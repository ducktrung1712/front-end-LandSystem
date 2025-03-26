
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Infor.css";

const PersonalInfo = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    username: "",
    password:"",
    birthday:"",
    hometown: "",
    phone: "",
    role: "",
    workGroup: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [workgroups, setWorkgroups] = useState([]);

  const navigate = useNavigate();

  // Lấy userId từ localStorage
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
        setUser(response.data);
        setEditedUser(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
      }
    };

    fetchUser();
    fetchWorkgroups();
  }, [userId, navigate]);

  const fetchWorkgroups = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/workgroups");
      console.log("Dữ liệu nhóm công việc:", response.data);
      if (Array.isArray(response.data)) {
        setWorkgroups(response.data);
      }
    } catch (err) {
      console.error("Lỗi khi lấy nhóm công việc:", err);
    }
  };
  
  const getWorkgroupName = (workGroup) => {
    if (!workGroup || !workGroup.name) return "Chưa có nhóm";
    return workGroup.name;
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      // Kiểm tra dữ liệu trước khi gửi
      if (!editedUser.fullName || !editedUser.email || !editedUser.username) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc.");
        return;
      }
  
      // Gửi yêu cầu cập nhật
      const response = await axios.put(`http://localhost:8080/api/users/${userId}`, editedUser);
  
      // Kiểm tra phản hồi từ API
      if (response.status === 200) {
        setUser(editedUser);
        setIsEditing(false);
        alert("Cập nhật thông tin thành công!");
      } else {
        console.error("Lỗi khi cập nhật thông tin:", response.data);
        alert("Đã xảy ra lỗi khi cập nhật thông tin.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      alert("Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại sau.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Kiểm tra và cập nhật giá trị ngày sinh hợp lệ
    if (name === "birthday" && value) {
      const isValidDate = !isNaN(new Date(value).getTime());
      if (!isValidDate) {
        alert("Ngày sinh không hợp lệ.");
        return;
      }
    }
  
    setEditedUser({ ...editedUser, [name]: value });
  };

  return (
    <div className="personal-container">
      <h2 className="personal-title">Thông Tin Cá Nhân</h2>
      <div className="personal-info">
        {isEditing ? (
          <>
            <p>
              <strong>Họ và Tên:</strong>
              <input type="text" name="fullName" value={editedUser.fullName} onChange={handleChange} />
            </p>
            <p>
              <strong>Tên đăng nhập:</strong>
              <input type="text" name="username" value={editedUser.username} onChange={handleChange} />
            </p>
            <p>
              <strong>Mật Khẩu:</strong>
              <input type="text" name="password" value={editedUser.password} onChange={handleChange} />
            </p>
            <p>
              <strong>Ngày Sinh:</strong>
              <input 
                type="date" 
                name="birthday" 
                value={editedUser.birthday ? new Date(editedUser.birthday).toISOString().split("T")[0] : ""} 
                onChange={handleChange} 
              />
            </p>
            <p>
              <strong>Email:</strong>
              <input type="email" name="email" value={editedUser.email} onChange={handleChange} />
            </p>
            <p>
              <strong>Số điện thoại:</strong>
              <input type="text" name="phone" value={editedUser.phone} onChange={handleChange} />
            </p>
            <p>
              <strong>Địa chỉ:</strong>
              <input type="text" name="address" value={editedUser.hometown} onChange={handleChange} />
            </p>
            <p>
              <strong>Nhóm:</strong>
              <span>{getWorkgroupName(user.workGroup)}</span>
            </p>
            <p>
              <strong>Chức Vụ:</strong>
              <span>{user.role}</span>
            </p>
            <button className="save-button" onClick={handleSaveClick}>Lưu</button>
          </>
        ) : (
          <>
            <p><strong>Họ và Tên:</strong> {user.fullName}</p>
            <p><strong>Tên đăng nhập:</strong> {user.username}</p>
            <p><strong>Ngày sinh:</strong> {user.birthday ? new Date(user.birthday).toLocaleDateString("vi-VN") : ""}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Số điện thoại:</strong> {user.phone}</p>
            <p><strong>Địa chỉ:</strong> {user.hometown}</p>
            <p><strong>Nhóm:</strong> {getWorkgroupName(user.workGroup)}</p>
            <p><strong>Chức Vụ:</strong> {user.role}</p>
            <button className="edit-button" onClick={handleEditClick}>Chỉnh sửa</button>
          </>
        )}
      </div>
    </div>
  );
};

export default PersonalInfo;
