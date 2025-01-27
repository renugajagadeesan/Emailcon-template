import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import the CSS file
import { AiFillMail } from "react-icons/ai";
import { FaEnvelope,FaLock } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiConfig from "../apiconfig/apiConfig.js";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${apiConfig.baseURL}/api/auth/login`,
        {
          email,
          password,
        }
      );
      console.log(res.data.user); // Check the structure of the user data
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/home");
    } catch (error) {
      toast.error(error.response.data || "Error logging in");
    }
  };

  return (
    <div className="login-page">
      <div className="login-cover">
        <div className="login-container">
          <h2 className="login-header">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="login-input"
              />
            </div>
            <div className="input-container">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input"
              />
            </div>
            <div className="log-btn">
              <button type="submit" className="login-button login-submit">
                Login
              </button>
            </div>
            <div className="log-sign">
              <button
                onClick={() => navigate("/signup")}
                className="logins-button"
              >
                Don't have an account?
                <span style={{ color: "#007c89" }}>Signup</span>
              </button>
            </div>
          </form>
          <div className="log-sign">
            <button
              onClick={() => navigate("/admin-login")}
              className="login-button login-submit"
            >
              Way to AdminLogin
            </button>
          </div>
        </div>
        <div className="login-aside">
          <AiFillMail style={{ color: "white", fontSize: "40px" }} />
          <h2>Welcome Back...!</h2>
          <p>Here You go To Next Step, Your Login Here...!</p>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default Login;

