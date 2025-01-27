import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css"; // Import the CSS file
import { AiFillMail } from "react-icons/ai";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "admin@emailcon.com" && password === "admin123") {
      // Set token in localStorage
      localStorage.setItem("adminToken", "secret_key");
      navigate("/admin-dashboard");
    } else {
      toast.success("Invalid admin credentials");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-cover">
        <div className="admin-aside">
          <AiFillMail style={{ color: "white", fontSize: "90px" }} />
          <h2>Admin Access</h2>
          <p>View The Overall Access Content Here...</p>
        </div>
        <div className="admin-login-container">
          <h2 className="admin-login-header">Admin Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="admin-login-input"
              />
            </div>
            <div className="input-container">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="admin-login-input"
              />
            </div>
            <div className="Admin-submit">
              <button type="submit" className="admin-login-button">
                Login
              </button>
            </div>
            <div className="Admin-login">
              <button
                onClick={() => navigate("/login")}
                className="admin-login-button-2"
              >
                Way to Login
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default AdminLogin;

