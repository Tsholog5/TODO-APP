import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        username: email,
        password
      });

      if (response.status === 200) {
        setIsAuthenticated(true); // Mark user as authenticated
        localStorage.setItem('authToken', response.data.token); // Save token if using JWT
        navigate('/todolist'); // Redirect to the TodoList page
      } else {
        setError('Failed to login.');
      }
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.message : 'Failed to login. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Login</p>
        <p className="message">Welcome back! Please login to your account.</p>

        <label>
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit" className="submit-button">Login</button>
        {error && <p className="error">{error}</p>}

        <p className="register-link">
          If you don't have an account, <Link to="/register">register here</Link>.
        </p>
      </form>
    </div>
  );
}

export default Login;
