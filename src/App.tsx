import { useEffect, useState } from 'react'
import './App.css'
import './menu.css'
interface Task {
  id: number;
  text:string;
  completed: boolean;
  
}
interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  action?: () => void;
  subMenu?: MenuItem[];
  separator?: boolean;
  disabled?: boolean;
}
const mainMenu: MenuItem[] = [
  {id:"file", label:"File", subMenu:[
      {id:"new", label:"New", icon:"icon-new", action: () => console.log("new file")},
      {id:"open", label:"Open", icon:"icon-open", action: () => console.log("open file")},
      {id:"save", label:"Save", icon:"icon-save", action: () => console.log("save file")},
]},

];

mainMenu.push(
  {id:"edit", label:"Edit", subMenu:[
      {id:"undo", label:"Undo", icon:"icon-undo", action: () => console.log("undo action")},  
      {id:"redo", label:"Redo", icon:"icon-redo", action: () => console.log("redo action")},
      {id:"cut", label:"Cut", icon:"icon-cut", action: () => console.log("cut action")},
      {id:"copy", label:"Copy", icon:"icon-copy", action: () => console.log("copy action")},
      {id:"paste", label:"Paste", icon:"icon-paste", action: () => console.log("paste action")},
]}, 
  {id:"view", label:"View", subMenu:[
      {id:"zoomIn", label:"Zoom In", icon:"icon-zoomin", action: () => console.log("zoom in")},
      {id:"zoomOut", label:"Zoom Out", icon:"icon-zoomout", action: () => console.log("zoom out")}, 
      {id:"resetZoom", label:"Reset Zoom", icon:"icon-resetzoom", action: () => console.log("reset zoom")},
]}, 
  {id:"help", label:"Help", subMenu:[
      {id:"documentation", label:"Documentation", icon:"icon-docs", action: () => console.log("open documentation")},
      {id:"about", label:"About", icon:"icon-about", action: () => console.log("about this app")},
]}
);

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

 // notificar tarea vencida
 useEffect(() => {
  const interval = setInterval(() => {   
    const now = Date.now();
    tasks.forEach(task => {
      if (!task.completed && now - task.id > 86400000) { // 86400000 ms = 24 horas
        alert(`La tarea "${task.text}" ha vencido!`);
      }
    });
  }, 60000); // Verificar cada minuto
  return () => clearInterval(interval);
}, [tasks]);


  

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