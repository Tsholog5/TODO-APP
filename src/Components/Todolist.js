import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Todolist.css';

function TodoList() {
  const [items, setItems] = useState([]);
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editTask, setEditTask] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/tasks');
        setItems(response.data);
      } catch (error) {
        console.error('Failed to fetch todos', error);
      }
    };
    fetchItems();
  }, []);

  const handleAddItem = async () => {
    if (!task) return;

    try {
      const newItem = {
        name: task, // Changed from 'description' to 'name'
        priority: priority,
      };
      const response = await axios.post('http://localhost:3001/api/tasks', newItem);
      console.log('Added item response:', response.data); // Check the response
      setItems([...items, response.data]); // Add the new item to the list
      setTask(''); // Clear input field
      setPriority('Medium'); // Reset priority
    } catch (error) {
      console.error('Failed to add task', error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/tasks/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete todo', error);
    }
  };

  const handleEditItem = (index) => {
    setEditingIndex(index);
    setEditTask(items[index].name); // Changed from 'description' to 'name'
    setEditPriority(items[index].priority);
  };

  const handleUpdateItem = async () => {
    try {
      const updatedItem = {
        name: editTask, // Changed from 'description' to 'name'
        priority: editPriority,
      };
      await axios.put(`http://localhost:3001/api/tasks/${items[editingIndex].id}`, updatedItem);
      const updatedItems = items.map((item, index) =>
        index === editingIndex ? { ...item, ...updatedItem } : item
      );
      setItems(updatedItems);
      setEditingIndex(null);
      setEditTask('');
      setEditPriority('Medium');
    } catch (error) {
      console.error('Failed to update todo', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) // Changed 'description' to 'name'
  );

  return (
    <div className="todo-container">
      <h1>To-Do List</h1>

      <div className="add-item">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Task Description"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button onClick={handleAddItem}>Add</button>
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search tasks"
      />

      <ul className="todo-list">
        {filteredItems.map((item, index) => (
          <li key={item.id} className="todo-item">
            {editingIndex === index ? (
              <div>
                <input
                  type="text"
                  value={editTask}
                  onChange={(e) => setEditTask(e.target.value)}
                />
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <button onClick={handleUpdateItem}>Update</button>
                <button onClick={() => setEditingIndex(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <span>{item.name}</span> {/* Changed from 'description' to 'name' */}
                <span>({item.priority})</span>
                <button onClick={() => handleEditItem(index)}>Edit</button>
                <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
