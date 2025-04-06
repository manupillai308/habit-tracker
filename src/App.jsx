import { useState } from 'react';
import Calendar from './components/Calendar.jsx';
import Panel from './components/Panel.jsx';
import TaskList from "./components/TaskList";
import CreateTask from './components/CreateTask.jsx';
import UserTask from './components/UserTask.jsx';

function App() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showTask, setShowTask] = useState(false);
    const [showEventAdd, setShowEventAdd] = useState(false);
    const [showUserTask, setShowUserTask] = useState(false);
    const [curUserId, setCurUserId] = useState('');

    const resetToToday = () => {
      setSelectedDate(new Date());
    }
    const showUser = (id) =>{
      setShowUserTask(true);
      setCurUserId(id);
    }
    const closeUser = () =>{
      setShowUserTask(false);
      setCurUserId('');
    };

    const createTask = () => {
      setShowEventAdd(true);
    };

    const handleDateClick = ({month, year, date}) => {
        setSelectedDate(new Date(year, month, date));
        setShowTask(true);
    };
    const closeTask = () => {
        setShowTask(false);
    }
    const watchDemo = () => {
      window.open("https://drive.google.com/file/d/1VU8T79a7rTRjpZoDg5j5TSrGF28SWaNZ/view", "_blank");
    }

    return (
      <div className="">
        <p className="has-text-centered p-3 mb-0 is-size-1 title" style={{position: 'static', top: '0', zIndex: '1000'}}>Habit Tracker</p>
        <div onClick={watchDemo} className='has-text-black is-primary m-2 p-3 button' style={{'position': 'absolute', 'right':0, top:0}}>
            Watch Demo
        </div>
        <div className='container'>
            <div className="columns is-justify-content-center	m-0">
              <div className="column mr-3 is-half">
                <Calendar handleDateClick={handleDateClick} selectedDate={selectedDate} resetToToday={resetToToday} createTask={createTask}/>
              </div>
              <div className="column is-3 is-flex is-flex-direction-column is-justify-content-center" style={{minWidth: '330px'}}>
                <Panel selectedDate={selectedDate} showUser={showUser}/>
              </div>
            </div>
        </div>
        {showTask && <TaskList close={closeTask} selectedDate={selectedDate}/>}
        {showEventAdd && <CreateTask setShowEventAdd={setShowEventAdd}/>}
        {showUserTask && <UserTask userid={curUserId} close={closeUser} selectedDate={selectedDate}/>}
      </div>
    );
  }
  

export default App;