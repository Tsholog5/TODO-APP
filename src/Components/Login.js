import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    navigate('/Todolist');

    console.log(email)
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        "username":email,
        "password":password
      });

      // Check for successful response status
      if (response.status === 200) {
        navigate('/todolist'); // Redirect on successful login
      } else {
        setError('Failed to login.');
      }
    } catch (err) {
      // Log error for debugging
      console.error('Login error:', err);
      setError('Failed to login. Please try again.');
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

        {error && <p className="error">{error}</p>}

        <button type="submit" className="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
