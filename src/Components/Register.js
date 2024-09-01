import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/register', {
        username: email,
        password
      });

      if (response.status === 200) {
        navigate('/login');
      } else {
        setError('Failed to register.');
      }
    } catch (err) {
      console.error('Register error:', err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.message : 'Failed to register. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Register</p>
        <p className="message">Create your account to get started.</p>

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

        <button type="submit" className="submit-button">Register</button>
        {error && <p className="error">{error}</p>}

        <p className="login-link">
          If you already have an account, <Link to="/login">login here</Link>.
        </p>
      </form>
    </div>
  );
}

export default Register;
