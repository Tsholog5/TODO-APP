import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation({ isAuthenticated }) {
  return (
    <nav className="navbar">
      <ul>
        {!isAuthenticated && (
          <>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
        {isAuthenticated && (
          <li>
            <Link to="/todolist">Todolist</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
