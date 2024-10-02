// frontend/src/components/Auth/Login.js
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api'; // Import the centralized API service

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/users/login', { email, password });
  
      // Assuming the response contains both token and user data
      if (res.data.token && res.data.user) {
        // Store the token and user ID in localStorage
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user_id', res.data.user.id);  // Store the user ID
        localStorage.setItem('name', res.data.user.name);  // Store the user name
        console.log(res.data.user.name);

        // Show a success message
        toast.success('Logged in successfully');
        
        // Navigate to home or wherever necessary
        navigate('/');
      } else {
        toast.error('Login failed. No token or user info found.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };
  

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>.
      </p>
    </div>
  );
};

export default Login;
