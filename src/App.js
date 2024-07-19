import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import TodoList from './Components/Todolist';
import Navigation from './Components/Navigation';
import Register from './Components/Register';
import Home from './Components/Home';

function App() {
  return (
    <Router>
      <Navigation/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/todolist" element={<TodoList />} />
        <Route path="*" element={<Navigate  />} />

      </Routes>
    </Router>
  );
}

export default App;
