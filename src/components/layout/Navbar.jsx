import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./navbar.css";
import AddEditStoryPage from "../../pages/AddEditStoryPage";
import { FaUser } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const userName = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <nav className="navbar">
      <ul>
        {!token ? (
          <>
            <li>
              <Link to="/register" className="register-btn">
                Register Now
              </Link>
            </li>
            <li>
              <Link to="/login" className="login-btn">
                Sign in
              </Link>
            </li>
          </>
        ) : (
          <div className="logged-in">
            <li>
              <Link className="register-btn" onClick={openEditModal}>
                Add Story
              </Link>
            </li>

            <div className="story-page">
              {isEditModalOpen && (
                <AddEditStoryPage closeEditModal={closeEditModal} />
              )}
            </div>

            <li>
              <Link to="/bookmarks" className="register-btn">
                Bookmarks
              </Link>
            </li>
            <li>
              <div className="profile-icon"><FaUser/></div>
            </li>

            <div className="profile-menu" onClick={toggleDropdown}>
            
              <div className="menu-icon">&#9776;</div>
             
              <div className={`dropdown ${dropdownOpen ? "active" : ""}`}>
                <a href="#">{userName}</a>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
