import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

type Task = {
  id: number;
  title: string;
  description: string;
  completed?: boolean;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    axios.get('http://backend:3000/tasks')
      .then(res => setTasks(res.data))
      .catch(err => console.error('Error fetching tasks:', err));
  }, []);

  const addTask = () => {
    if (title.trim()) {
      axios.post('http://backend:3000/tasks', { title, description })
        .then(() => {
          setTitle(''); setDescription('');
          axios.get('http://backend:3000/tasks').then(res => setTasks(res.data));
        })
        .catch(err => console.error('Error adding task:', err));
    }
  };

  const completeTask = (id: number) => {
    axios.put(`http://backend:3000/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(err => console.error('Error completing task:', err));
  };

  return (
    <div className="app">
      <h1>To-Do App</h1>
      <div className="input-group">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <span>{task.title} - {task.description}</span>
            <button onClick={() => completeTask(task.id)}>Done</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;