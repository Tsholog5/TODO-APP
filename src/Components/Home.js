import React from 'react';
import Navigation from './Navigation'; 
import './home.css';

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">TODO-LIST APP</h1>
      <Navigation /> 
    </div>
  );
}

export default Home;
