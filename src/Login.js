import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        account: account,
        password: password,
      });

      const user = response.data;

      // Lưu thông tin user vào localStorage
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userRole", user.role);

      // Điều hướng theo role
      switch (user.role) {
        case "Manager":
          navigate("/manager");
          break;
        case "Inspector":
          navigate("/inspector");
          break;
        case "Worker":
          navigate("/worker");
          break;
        default:
          setMessage("Vai trò không hợp lệ!");
      }
    } catch (error) {
      setMessage("Tài khoản hoặc mật khẩu không hợp lệ!");
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Đăng nhập</h2>
        <div className="form-group">
          <label>Tài khoản hoặc email:</label>
          <input
            type="text"
            placeholder="Nhập tài khoản hoặc email"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Mật khẩu:</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className="toggle-password toggle-password-unbackground" onClick={togglePassword} >
              {showPassword ? "👁" : "🙈"}
            </button>
          </div>
        </div>
        <button type="submit" className="login-button">
          Đăng nhập
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Login;
