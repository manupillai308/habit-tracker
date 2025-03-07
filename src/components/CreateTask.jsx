import Modal from './Modal.jsx';
import useDBContext from '../hooks/use-db-context.js';
import {createNewTask} from '../context/planner.jsx';
import { useState } from 'react';


function CreateTask({setShowEventAdd}) {
    const [data, setData] = useState(createNewTask());
    const [isOpen, setOpen] = useState(false);
    const { userDB, getUserById, addTask } = useDBContext();

    const saveChanges = () =>{
        addTask({task: data});
        setShowEventAdd(false);
    }

    const assignees = data.participants.map((user_id) => {
        const user = getUserById(user_id);
        if(user){
            return <span key={user.id} className="tag is-hoverable is-primary is-medium">
            {user.name}
            <button onClick={() => removeParticipant(user.id)} className="delete is-small"></button>
        </span>
        }
    });
    const setPs = (ps) => {
        setData({...data, participants: ps});
    };

    const setPts = (pts) => {
        setData({...data, pts: JSON.stringify(pts)});
    };

    const setDueDate = (date) => {
        setData({...data, dueDate: date});
    };

    const removeParticipant = (val) => {
        const updatedPs = data.participants.filter((p) => p != val);
        setPs(updatedPs);
    };

    const addParticipant = (val) => {
        const updatedPs = data.participants.concat(val);
        setPs(updatedPs);
    };

    const userDropdown = userDB.map((user) => {
        if(!data.participants.includes(user.id))
            return (
                <span key={user.id} onClick={() => addParticipant(user.id)} className="tag is-hoverable is-primary is-medium">
                    {user.name}
                    <span className='icon is-small ml-1'>
                        <i className="fas fa-plus fa-xs"></i>
                    </span>
                </span>
            );
    });

    const close = () => {
        setShowEventAdd(false);
    };

    const setHeader = (header) => {
        setData({...data, title: header});
    };

    const setBody = (body) => {
        setData({...data, desc: body});
    };

    const handleChange = (event) => {
        if (event.target.name == 'header') setHeader(event.target.value);
        else if (event.target.name == 'body') {
            if (event.target.value.length <= 40) setBody(event.target.value);
        }
        else if (event.target.name == 'pts'){
            const val = Number(event.target.value);
            if(val <= 1000) setPts(val);
        }
        else if (event.target.name == 'duedate'){
            const localDate = new Date(event.target.value);
            try{
                setDueDate(localDate.toISOString());
            } catch (error){
                setDueDate(new Date().toISOString());
            }
        }
    };

    return (
        <Modal portalClass={'.modal-container'} title="Start a Habit"
        actionButtons={(
            <div className="buttons">
                <button className="button is-success" onClick={saveChanges}>Save</button>
                <button className="button is-danger" onClick={close}>Cancel</button>
            </div>)}>
            <div>
                <div className=''>
                    <div className="is-flex is-justify-content-space-between">
                        <div>
                            <div className='mb-3'>
                                <label htmlFor="habit-title" className='title is-size-5'>What's the Habit?</label><br/>
                                <input id='habit-title' name='header' value={data.title} onChange={handleChange} className=' is-size-5 pb-1 mt-2'/>
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="habit-desc" className='subtitle is-size-6'>A helpful description?</label>
                                <input id='habit-desc' name='body' value={data.desc} onChange={handleChange} className=' is-size-6 pb-1 ml-1'/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='mb-3'>
                            <label htmlFor="habit-pts" className=' is-size-6'>How many <span className="icon is-size-5" style={{color: '#FFD700'}}>
                                <i className="fas fa-star"></i>
                            </span> ?</label>
                            <input type="number" id='habit-pts' name='pts' value={data.pts} onChange={handleChange} className=' is-size-6 pb-1 ml-1'/>
                        </div>
                    </div>
                    <div>
                        <div className='mb-3'>
                            <label htmlFor="habit-due-date" className=' is-size-6'>When do you want it due?</label>
                            <input type="date" id='habit-due-date' name='duedate' value={data.dueDate.split("T")[0]} onChange={handleChange} className=' is-size-6 pb-1 ml-1'/>
                        </div>
                    </div>
                    <div className='pt-2'>
                        <div className="tags are-medium">
                            Assignees: {assignees}
                            <div style={{"position": "relative"}}>
                                <span onClick={() => setOpen(!isOpen)} className="icon is-normal is-clickable">
                                    <i className={`fas fa-${isOpen ? 'xmark':'plus'}`}></i>
                                </span>
                                {isOpen ? 
                                <div className="box tags" style={{"position": "absolute"}}>
                                    {userDropdown}
                                </div>
                                :
                                null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default CreateTask;