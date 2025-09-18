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
  
  //container de tareas
  const taskContainerStyle: React.CSSProperties = {
    maxHeight: '300px',
    overflowY: 'auto',
    border: '1px solid #494949ff',
    backgroundColor: '#727272ff',
    padding: '10px',
    marginTop: '10px'
  };
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
    // editTask
    const editTask = (id: number , newText: string) => {
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, text: newText } : task
      ));
    }

    //fecha tareas  
    const getFormattedDate = (date: Date): string => {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    };
    const currentDate = new Date();
    const formattedDate = getFormattedDate(currentDate);
    console.log(formattedDate); // Ejemplo de uso
      
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
    <img src="https://cdn-icons-png.flaticon.com/512/9839/9839259.png" alt="Logo" style={{ width: '100px', height: '100px' }}/>
      <h1>Lista de Tareas</h1>
      <input 
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)} 
        placeholder="Nueva tarea" 
      />
      <input type="text" value={formattedDate} readOnly />
      <button onClick={addTask}style={{background:"green"}}>Agregar</button>
      <ul style={taskContainerStyle}>
        <ul>
          {tasks.length === 0 && <li>No hay tareas Agrege Una</li>}
        </ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span 
              style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
              onClick={() => toggleTaskCompletion(task.id)}
            >
              {task.text}
              {getFormattedDate(new Date(task.id))}
              {task.completed ? ' (Completada)' : ''}
              {Date.now() - task.id > 86400000 && ' (Vencida)'}
            </span>
            <button onClick={() => deleteTask(task.id)}>Eliminar</button>
            <button onClick={() => {
              const newText = prompt('Editar tarea', task.text);
              if (newText !== null && newText.trim() !== '') {
                editTask(task.id, newText);
              }
            }} style={{background:"yellow",color:"black"}}>Editar</button>
          </li>
        ))}
         <button onClick={clearTasks}style={{background:"red"}}>Eliminar todas las tareas</button> 
      </ul>
    </div>
  );
}

export default App;