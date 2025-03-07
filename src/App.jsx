import { useState } from 'react';
import Calendar from './components/Calendar.jsx';
import Panel from './components/Panel.jsx';
import TaskList from "./components/TaskList";
import CreateTask from './components/CreateTask.jsx';

function App() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showTask, setShowTask] = useState(false);
    const [showEventAdd, setShowEventAdd] = useState(false);

    const resetToToday = () => {
      setSelectedDate(new Date());
    }

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

    return (
      <div className="">
        <p className="has-text-centered p-3 mb-0 is-size-1 title" style={{position: 'static', top: '0', zIndex: '1000'}}>Habit Tracker</p>
        <div className='container'>
            <div className="columns is-justify-content-center	m-0">
              <div className="column mr-3 is-half">
                <Calendar handleDateClick={handleDateClick} selectedDate={selectedDate} resetToToday={resetToToday} createTask={createTask}/>
              </div>
              <div className="column is-3 is-flex is-flex-direction-column is-justify-content-center" style={{minWidth: '330px'}}>
                <Panel selectedDate={selectedDate}/>
              </div>
            </div>
        </div>
        {showTask && <TaskList close={closeTask} selectedDate={selectedDate}/>}
        {showEventAdd && <CreateTask setShowEventAdd={setShowEventAdd}/>}
      </div>
    );
  }
  

export default App;