import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css"; // Import the CSS file
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function AdminDashboard() {
  const [users, setUsers] = useState([]);
   const [loading, setLoading] = useState(false); // State for the loader
   const [loadingUserId, setLoadingUserId] = useState(null); // State for the specific user being updated

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get("http://localhost:5000/api/admin/users");
      setUsers(response.data);
    };
    fetchUsers();
  }, []);
   const navigate = useNavigate();

   const handleLogout = () => {
     localStorage.removeItem("adminToken");
     navigate("/");
   };

  const handleStatusChange = async (id, status) => {
    setLoading(true);
    setLoadingUserId(id); // Set the ID of the user being updated

    try {
      await axios.post("http://localhost:5000/api/admin/update-status", {
        id,
        status,
      });
      toast.success(`Account ${status ? "Activated" : "Deactivated"}`, { autoClose: 3000 });
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isActive: status } : user
        )
      );
    } catch (error) {
      toast.error("Error updating status", { autoClose: 3000 });
    } finally {
      setLoading(false);
      setLoadingUserId(null); // Reset the ID after update
    }
  };

  return (
    <div className="admin-dashboard-page">
      <div className="admin-nav">
      <h2 className="admin-dashboard-header">Admin Dashboard</h2>
        <button onClick={handleLogout} className="admin-nav-button">
            <span className="admin-nav-icons">
              <FaSignOutAlt />
            </span>{" "}
            <span className="nav-names">Logout</span>
          </button>
          </div>
                <h2 className="admin-dashboard-heading">Emailcon Signup Details</h2>

      <table className="admin-dashboard-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>Password</th>
            <th>smtp passcode</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>{user.password}</td>
              <td>{user.smtppassword}</td>
              <td>{user.isActive ? "Active" : "Inactive"}</td>
              <td>
                {loading && loadingUserId === user._id ? (
                  <div className="loader"></div> // Render a loader for the specific user
                ) : (
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={user.isActive}
                      onChange={() =>
                        handleStatusChange(user._id, !user.isActive)
                      }
                    />
                    <span className="slider"></span>
                  </label>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
<ToastContainer 
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
/>
       
    </div>
  );
}

export default AdminDashboard;