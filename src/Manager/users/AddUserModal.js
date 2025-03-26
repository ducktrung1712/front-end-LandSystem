import { useState, useEffect } from "react";
import axios from "axios";
import "./AddUserModal.css";

function AddUserModal({ onClose, onUserAdded }) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Worker");
  const [workGroup, setWorkGroup] = useState("");
  const [workGroups, setWorkGroups] = useState([]);
  const [hometown, setHometown] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [error, setError] = useState("");

  // Lấy danh sách nhóm làm việc từ API
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

    // Validate username
    const usernameRegex = /^[A-Za-z0-9]+$/;
    if (!usernameRegex.test(username)) {
      setError("Tài khoản chỉ được chứa chữ cái và số, không có khoảng trắng hay dấu đặc biệt.");
      return;
    }

    // Validate password
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
    if (!passwordRegex.test(password)) {
      setError("Mật khẩu phải chứa ít nhất một chữ cái và một số.");
      return;
    }

    // Validate email
    if (!email.includes("@")) {
      setError("Email phải chứa ký tự '@'.");
      return;
    }

    // Validate phone number
    const phoneRegex = /^(?:\+84|0)[0-9]{9,10}$/;
    if (phone && !phoneRegex.test(phone)) {
      setError("Số điện thoại không hợp lệ. Vui lòng nhập số hợp lệ của Việt Nam.");
      return;
    }

    const newUser = {
      fullName,
      username,
      email,
      password,
      role,
      hometown,
      phone,
      birthday: birthday || null, // Nếu không nhập, gửi null
      workGroup: workGroup ? { id: parseInt(workGroup, 10) } : null    };

    try {
      await axios.post("http://localhost:8080/api/users", newUser);
      onUserAdded();
      onClose();
    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error);
      setError("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Thêm Người Dùng Mới</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ tên:</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Tài khoản:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Chỉ chữ và số, không khoảng trắng" />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={email || ""} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Mật khẩu:</label>
            <input type="password" value={password || ""} onChange={(e) => setPassword(e.target.value)} required placeholder="Phải có ít nhất 1 chữ và 1 số" />
          </div>
          <div className="form-group">
            <label>Quê quán:</label>
            <input type="text" value={hometown} onChange={(e) => setHometown(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Số điện thoại:</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Nhập số điện thoại hợp lệ" />
          </div>
          <div className="form-group">
            <label>Ngày sinh:</label>
            <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
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
            <button type="submit">Thêm</button>
            <button type="button" onClick={onClose}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUserModal;
