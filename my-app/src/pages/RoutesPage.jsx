import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "../component/Signup";
import Login from "../component/Login";
import AdminLogin from "../component/AdminLogin";
import AdminDashboard from "../component/AdminDashboard";
import Mainpage from "./Mainpage";


function RoutesPage() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/home" element={<Mainpage/>} />
      </Routes>
    </Router>
  );
}

export default RoutesPage;