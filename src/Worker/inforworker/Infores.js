import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Infor.css";

const PersonalInfo = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    role: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

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
  }, [userId, navigate]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(`http://localhost:8080/api/users/${userId}`, editedUser);
      setUser(editedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
    }
  };

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
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
              <strong>Email:</strong>
              <input type="email" name="email" value={editedUser.email} onChange={handleChange} />
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
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Chức Vụ:</strong> {user.role}</p>
            <button className="edit-button" onClick={handleEditClick}>Chỉnh sửa</button>
          </>
        )}
      </div>
    </div>
  );
};

export default PersonalInfo;
