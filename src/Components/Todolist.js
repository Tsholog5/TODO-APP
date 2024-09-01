import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Todolist.css';

function TodoList() {
  const [items, setItems] = useState([]);
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editTask, setEditTask] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');
  const [error, setError] = useState('');
  const [showProfile, setShowProfile] = useState(false); // State to control profile visibility
  const [profileData, setProfileData] = useState({ name: '', email: '', phone: '' }); // State to hold profile data
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await axios.get('http://localhost:3001/api/tasks');
        setItems(response.data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to fetch tasks.');
      }
    }

    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!task) {
      setError('Task name is required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/tasks', { name: task, priority });
      setItems([...items, response.data]);
      setTask('');
      setPriority('Medium');
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task.');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/tasks/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task.');
    }
  };

  const handleEditTask = async (id) => {
    if (!editTask) {
      setError('Task name is required.');
      return;
    }

    try {
      await axios.put(`http://localhost:3001/api/tasks/${id}`, { name: editTask, priority: editPriority });
      setItems(items.map(item => item.id === id ? { ...item, name: editTask, priority: editPriority } : item));
      setEditingIndex(null);
      setEditTask('');
      setEditPriority('Medium');
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleProfileClick = async () => {
    setShowProfile(!showProfile); // Toggle profile visibility

    if (!profileData.name && !profileData.email && !profileData.phone) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:3001/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfileData(response.data);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile information.');
      }
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put('http://localhost:3001/api/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowProfile(false); // Hide form after updating profile
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile.');
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="todo-container">
      <div className="form-container">
        <button onClick={handleProfileClick} className="profile-button">Profile</button>
        <button onClick={handleLogout} className="logout-button">Logout</button>
        <h1 className="title">Todo List</h1>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Task name"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="input"
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="select">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button onClick={handleAddTask} className="submit-button">Add Task</button>
        {error && <p className="error">{error}</p>}
      </div>

      {showProfile && (
        <div className="profile-container">
          <h2>Edit Profile</h2>
          <input
            type="text"
            placeholder="Name"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            className="input"
          />
          <input
            type="email"
            placeholder="Email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            className="input"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={profileData.phone}
            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            className="input"
          />
          <button onClick={handleProfileUpdate} className="submit-button">Update Profile</button>
        </div>
      )}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id}>
                {editingIndex === item.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={editTask}
                        onChange={(e) => setEditTask(e.target.value)}
                        className="input"
                      />
                    </td>
                    <td>
                      <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)} className="select">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </td>
                    <td className="actions">
                      <button onClick={() => handleEditTask(item.id)} className="edit-button">Save</button>
                      <button onClick={() => setEditingIndex(null)} className="delete-button">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="task-name">{item.name}</td>
                    <td className="task-priority">{item.priority}</td>
                    <td className="actions">
                      <button onClick={() => handleDeleteTask(item.id)} className="delete-button">Delete</button>
                      <button onClick={() => {
                        setEditingIndex(item.id);
                        setEditTask(item.name);
                        setEditPriority(item.priority);
                      }} className="edit-button">Edit</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TodoList;
