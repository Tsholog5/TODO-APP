import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if all fields are filled
    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Register logic here (e.g., send data to backend or handle registration)
    
    // Assume registration is successful and redirect to login
    // You would replace the below line with actual registration logic
    // and only redirect on success
    navigate('/login');
  };

  return (
    <div className='form-container'>
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Register</p>
        <p className="message">Signup now and get full access to our app.</p>
        
        <div className="flex">
          <label>
            <input
              className="input"
              type="text"
              placeholder=""
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
            <span>Firstname</span>
          </label>

          <label>
            <input
              className="input"
              type="text"
              placeholder=""
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
            <span>Lastname</span>
          </label>
        </div>

        <label>
          <input
            className="input"
            type="email"
            placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <span>Email</span>
        </label>

        <label>
          <input
            className="input"
            type="password"
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span>Password</span>
        </label>

        <label>
          <input
            className="input"
            type="password"
            placeholder=""
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span>Confirm password</span>
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="submit">
          Submit
        </button>

        <p className="signin">
          Already have an account? <a href="#">Sign in</a>
        </p>
      </form>
    </div>
  );
}

export default Register;
