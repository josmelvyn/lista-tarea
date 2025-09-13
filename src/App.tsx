import { useEffect, useState } from 'react'
import './App.css'
interface Task {
  id: number;
  text:string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState<string>('');
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  // Agrega tarea
  const addTask = () => {
    if (!newTask.trim()) return; // Evita agregar tareas vacías{
      const task: Task = {
        id: Date.now(),
        text: newTask,
        completed: false
      };
      setTasks([...tasks, task]);
      setNewTask(''); // Limpiar el campo de entrada
    };
      
  // Elimina tarea
  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  // Eliminar todas las tareas
  const clearTasks = () => {
    setTasks([])
  };
  // Marca tarea como completada
  const toggleTaskCompletion = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
   <div>
      <h1>Lista de Tareas</h1>
      <input 
        type="text"
        value={newTask} 
        onChange={(e) => setNewTask(e.target.value)} 
        placeholder="Nueva tarea" 
      />
      <button onClick={addTask}>Agregar</button>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span 
              style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
              onClick={() => toggleTaskCompletion(task.id)}
            >
              {task.text}
            </span>
            <button onClick={() => deleteTask(task.id)}>Eliminar</button>
          </li>
        ))}
         <button onClick={clearTasks}>Eliminar todas las tareas</button>
      </ul>
    </div>
  );
}

export default App;