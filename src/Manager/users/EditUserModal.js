import React, { useState, useEffect } from "react";
import axios from "axios";

function EditUserModal({ user, onClose, onUserUpdated }) {
  const [fullName, setFullName] = useState(user.fullName);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(user.role);
  const [workGroup, setWorkGroup] = useState(user.workGroup ? user.workGroup.id : ""); // Lưu ID nhóm
  const [workGroups, setWorkGroups] = useState([]); // Danh sách nhóm làm việc
  const [hometown, setHometown] = useState(user.hometown || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [birthday, setBirthday] = useState(user.birthday || ""); // Giữ định dạng YYYY-MM-DD
  const [error, setError] = useState("");

  // Lấy danh sách nhóm làm việc từ API khi modal mở
  useEffect(() => {
    axios.get("http://localhost:8080/api/workgroups")
      .then((response) => {
        setWorkGroups(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách nhóm:", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate email
    if (!email.includes("@")) {
      setError("Email không hợp lệ.");
      return;
    }

    // Validate phone number
    const phoneRegex = /^(?:\+84|0)[0-9]{9,10}$/;
    if (phone && !phoneRegex.test(phone)) {
      setError("Số điện thoại không hợp lệ.");
      return;
    }

    const updatedUser = {
      fullName,
      username,
      email,
      password: password || user.password, // Nếu không nhập mật khẩu mới, giữ nguyên mật khẩu cũ
      role,
      hometown,
      phone,
      birthday: birthday || null, // Nếu không nhập, gửi null
      workGroup: workGroup ? { id: parseInt(workGroup, 10) } : null, // Đảm bảo gửi đúng định dạng
    };

    try {
      await axios.put(`http://localhost:8080/api/users/${user.id}`, updatedUser);
      onUserUpdated();
      onClose();
    } catch (err) {
      console.error("Lỗi khi cập nhật người dùng:", err);
      setError("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Sửa Tài Khoản</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ tên:</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Tài khoản:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu (bỏ trống nếu không đổi):</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Quê quán:</label>
            <input
              type="text"
              value={hometown}
              onChange={(e) => setHometown(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Ngày sinh:</label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Vai trò:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Inspector">Inspector</option>
              <option value="Worker">Worker</option>
            </select>
          </div>
          <div className="form-group">
            <label>Nhóm làm việc:</label>
            <select value={workGroup} onChange={(e) => setWorkGroup(e.target.value)}>
              <option value="">Chọn nhóm</option>
              {workGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="submit">Lưu</button>
            <button type="button" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;
