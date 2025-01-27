import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css"; // Import the CSS
import { FaEnvelope, FaUser, FaLock } from "react-icons/fa";
import { AiFillMail } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [smtppassword,setSmtppassword]=useState("");
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("http://localhost:5000/api/auth/signup", {
      email,
      username,
      password,
      smtppassword,
    });

    // Display the success toast
    toast.success(response.data.message || "Account created successfully!");

    // Navigate to login after the toast message is shown
    setTimeout(() => {
      navigate("/");
    }, 4000); // A shorter delay to allow the toast to appear before navigation

  } catch (error) {
    toast.error(error.response ? error.response.data : "Error signing up");
  }
};


  return (
    <div className="signup-page">
      <div class="signup-cover">
        <div className="signup-aside">
          <AiFillMail style={{ color: "white", fontSize: "40px" }} />
          <h2>Welcome To Emailcon...!</h2>
          <p>Create Your Template To Enhance Our Connection.</p>
        </div>
        <div className="signup-container">
          <h2 className="signup-header">Signup</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Hostinger Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="signup-input"
              />
            </div>
            <div className="input-container">
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="signup-input"
              />
            </div>
            <div className="input-container">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="User Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="signup-input"
              />
            </div>
            <div className="input-container">
              <FaLock className="input-icon" />
              <input
                type="text"
                placeholder="Hostinger Password"
                value={smtppassword}
                onChange={(e) => setSmtppassword(e.target.value)}
                required
                className="signup-input"
              />
            </div>
            <div className="sub-btn">
              <button type="submit" className="signup-button signup-submit">
                Submit
              </button>
            </div>
            <div className="sign-log">
            <button
              onClick={() => navigate("/")}
              className="signups-button signup-alt-button"
            >
              Already have an account?<span style={{color:"#007c89"}}>Login</span>
            </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default Signup;