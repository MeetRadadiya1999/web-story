import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import AddEditStoryPage from './pages/AddEditStoryPage';
import BookmarkPage from './pages/BookmarkPage';
import ProfilePage from './pages/ProfilePage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/layout/PrivateRoute';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/add-story" element={<PrivateRoute element={AddEditStoryPage} />} />
          <Route path="/edit-story/:id" element={<PrivateRoute element={AddEditStoryPage} />} />
          <Route path="/bookmarks" element={<PrivateRoute element={BookmarkPage} />} />
          <Route path="/profile" element={<PrivateRoute element={ProfilePage} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
