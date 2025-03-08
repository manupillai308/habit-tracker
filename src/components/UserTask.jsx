import Modal from './Modal.jsx';
import useDBContext from '../hooks/use-db-context.js';
import { useState } from 'react';

function TaskStatus({task, completed, setCompleted}){

    return (
        <div className='has-border-sm p-2 level m-1'>
            <div className='has-text-centered-mobile'>
                <p className='has-text-weight-semibold'>{task.title}</p>
                <p>{task.desc}</p>
            </div>
            {
            completed ? 
                <button onClick={() => setCompleted(task)} className='has-text-success'>
                    <i className="fa-solid fa-toggle-on fa-2xl"></i>
                </button>
            :
                <button onClick={() => setCompleted(task)} className='has-text-danger'>
                    <i className="fa-solid fa-toggle-off fa-2xl"></i>
                </button>
            }
        </div>
    );
};

function UserTask ({userid, close, selectedDate}){
    const { getUserById, getTaskByDate, updateUser } = useDBContext();
    const [userData, setUserData] = useState(getUserById(userid));
    const [curDate, setCurDate] = useState(selectedDate);
    const userTasks = Object.values(getTaskByDate(curDate)).filter((task) => {
        return task.participants.includes(userData.id);
    });
    const datekey = curDate.toISOString().split("T")[0];
    const completedToday = userData.completed[datekey] ?? [];

    const commitTask = () =>{
        updateUser({user: userData});
        close();
    };


    const setCompleted = ({id: task_id, pts: task_pts}) => {
        const index = completedToday.indexOf(task_id);
        if(index !== -1){
            setUserData({...userData, completed: {...userData.completed, [datekey]: completedToday.filter(id => id !== task_id)}, pts: (userData.pts)-(task_pts)});
        }
        else{
            setUserData({...userData, completed: {...userData.completed, [datekey]: completedToday.concat(task_id)}, pts: (userData.pts)+(task_pts)});
        }
    };

    const setYesterDay = () => {
        setCurDate(new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate()-1));
    };

    const setTomorrow = () => {
        setCurDate(new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate()+1));
    };

    return (
        <Modal portalClass={'.modal-container'} title={`${userData.name}'s Report`}
        actionButtons={null} closeButton={<button className="delete" aria-label="close" onClick={commitTask}></button>}>
            <div className=''>
                <div className='has-text-centered'>
                    <p className='is-size-4'>
                        Total: {userData.pts} <span className="icon" style={{color: '#FFD700'}}>
                                            <i className="fas fa-star"></i>
                        </span>
                    </p>
                </div>
                <div className='level'>
                    <div className='level-left'>
                        <div className='level-item'>
                            <div className="button" onClick={setYesterDay}>
                                <div className="icon">
                                    <i className="fa-solid fa-chevron-left"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='level-item has-text-centered'>
                        <p className='subtitle'>
                            Tasks for {curDate.toLocaleString('default', {month: 'long', year: 'numeric', day:'numeric'})}
                        </p>
                    </div>
                    <div className='level-right'>
                        <div className='level-item'>
                            <div className="button" onClick={setTomorrow}>
                                <div className="icon">
                                    <i className="fa-solid fa-chevron-right"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {userTasks.map((task) => {
                    return <TaskStatus key={task.id} task={task} setCompleted={setCompleted} completed={completedToday.includes(task.id)}/>
                })}
            </div>
        </Modal>
    );
}

export default UserTask;