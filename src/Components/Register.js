import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import {useNavigate} from 'react-router-dom'

function Register() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();


  
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/register', {
        "username":email,
        "password":password
      });
      alert(response.data.message);
      navigate ('/login')
    } catch (error) {
      setError(error.message || 'Failed to register. Please try again.');
    }
  };

  const handleSignInClick = (event) => {
    event.preventDefault();
    navigate('/login');
  };

  return (
    <div className='form-container'>
        <p className="title">Register</p>
        <p className="message">Signup now and get full access to our app.</p>
        
        <div className="flex">
          <label>
            <input
              className="input"
              type="text"
              placeholder="Firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </label>

          <label>
            <input
              className="input"
              type="text"
              placeholder="Lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </label>
        </div>

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

        <label>
          <input
            className="input"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="submit" onClick={handleSubmit}>
          Submit
        </button>

        <p className="signin">
          Already have an account? <a href="#" onClick={handleSignInClick}>Sign in</a>
        </p>
    </div>
  );
}

export default Register;
