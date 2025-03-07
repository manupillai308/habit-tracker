import { useState } from "react";
import Tile from './Tile';
import useDBContext from '../hooks/use-db-context.js';
import useWindowSize from "../hooks/use-window-size.js";


function Calendar({handleDateClick, selectedDate, resetToToday, createTask}) {
    const [currentDate, setCurrentDate] = useState(new Date(selectedDate));
    const { getTaskByDate } = useDBContext();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysinMonth = new Date(year, month + 1, 0).getDate();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };
    
    const getToday = () =>{
        setCurrentDate(new Date());
        resetToToday();
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const isSameDate = (d1, d2) => 
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    const blanks = Array(firstDay).fill(null);
    const days = Array.from({ length: daysinMonth}, (_, i) => i+1);

    const {width: windowWidth} = useWindowSize();


    return (
        <div className="box has-border-sm">
            <div className="level">
                <div className="level-left">
                    <div className="button" onClick={() => handlePrevMonth()}>
                        <div className="icon">
                            <i className="fa-solid fa-chevron-left"></i>
                        </div>
                    </div>
                    <div disabled={isSameDate(selectedDate,currentDate)} className="button" onClick={getToday}>
                        Today
                    </div>
                </div>
                {<div className="level-item is-size-4">{currentDate.toLocaleString('default', {month: 'long', year: 'numeric'})}</div>}
                <div className="level-right">
                    <div className="button is-primary" onClick={createTask}>
                        Habit
                        <div className="icon is-size-7 ml-1">
                            <i className="fa-solid fa-plus"></i>
                        </div>
                    </div>
                    <div className="button" onClick={() => handleNextMonth()}>
                        <div className="icon">
                            <i className="fa-solid fa-chevron-right"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div className="has-text-centered fixed-grid has-7-cols">
                <div className="grid has-border-sm">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="is-size-5">{day}</div>
                    ))}
                </div>
                <div className="grid">
                    { blanks.map((_, i) => (
                        <Tile key={`blank-${i}`} className="calendar-day blank"></Tile>
                        ))
                    }
                    {days.map((date) => (
                    <Tile key={date} isSelected={isSameDate(new Date(year, month, date),selectedDate)} onClick={() => handleDateClick({month, year, date})}>
                        {date}
                        {/* {'-' + getTaskByDate(new Date(year, month, date)).length} */}
                        {
                            windowWidth >= 1450 ? getTaskByDate(new Date(year, month, date)).slice(0, 2).map((task) => {

                                return (<div key={task.id} className=" has-background-success is-size-7 mb-1">
                                {task.title}
                                </div>);
                            })
                            :
                            windowWidth >= 500 ?
                            <div className="has-text-success is-size-7 mb-1">
                                {
                                    getTaskByDate(new Date(year, month, date)).length > 0 && <i className="fa-solid fa-bars-staggered"></i>
                                }
                            </div>
                            :
                            null
                        }
                    </Tile>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Calendar;