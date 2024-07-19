import React, { useState } from 'react';
import  "./Todolist.css"; 

function TodoList() {
  const [items, setItems] = useState([]);
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editTask, setEditTask] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');

  const handleAddItem = () => {
    if (!task) return;

    const newItem = {
      description: task,
      priority: priority,
      id: Date.now(), 
    };
    setItems([...items, newItem]);
    setTask('');
    setPriority('Medium');
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleEditItem = (index) => {
    setEditingIndex(index);
    setEditTask(items[index].description);
    setEditPriority(items[index].priority);
  };

  const handleUpdateItem = () => {
    const updatedItems = items.map((item, index) =>
      index === editingIndex
        ? { ...item, description: editTask, priority: editPriority }
        : item
    );
    setItems(updatedItems);
    setEditingIndex(null);
    setEditTask('');
    setEditPriority('Medium');
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredItems = items.filter(item =>
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
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
        <button onClick={handleAddItem}>Add Item</button>
      </div>

      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
      />

      <ul className="todo-list">
        {filteredItems.map((item, index) => (
          <li key={item.id} className={`todo-item ${item.priority.toLowerCase()}`}>
            <span>{item.description}</span>
            <span className={`priority ${item.priority.toLowerCase()}`}>{item.priority}</span>
            <button onClick={() => handleEditItem(index)}>Edit</button>
            <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {editingIndex !== null && (
        <div className="edit-item">
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
          <button onClick={handleUpdateItem}>Update Item</button>
        </div>
      )}
    </div>
  );
}

export default TodoList;
