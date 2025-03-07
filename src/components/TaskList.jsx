import useDBContext from '../hooks/use-db-context.js';
import Modal from './Modal.jsx';
import React, { useState } from 'react';
import Task from './Task.jsx';

function confirmComponent({callback1, callback2, title, body, close}){
    return (
    <Modal portalClass={'.modal-re-assure'} title={title}
        actionButtons={(
            <div className="buttons">
                <button className="button is-danger" onClick={callback1}>All Occurences</button>
                <button className="button i" onClick={callback2}>Just This!</button>
            </div>)} closeButton={<button className="delete" aria-label="close" onClick={close}></button>}>
        {body}
    </Modal>
);
}

function TaskList({close, selectedDate}){

    const { getTaskByDate, saveTask } = useDBContext();
    const [tasks, setTasks] = useState(getTaskByDate(selectedDate));
    const [deletes, setDeletes] = useState([]);
    const [onEdit, setOnEdit] = useState(false);
    const [componentData, setComponentData] = useState({
        active: false,
        props: {}
    });
    
    const commitTask = () => {
        saveTask({tasks, deletes, targetDate: selectedDate});
        close();
    };

    const resetConfirm = () => {
        setComponentData({
            active: false,
            props: {}
        })
    };

    const onSubmit = ({payload, callback}) =>{
        if(payload.type === 'one') return callback();
        setComponentData({
            active: true,
            props: {
                title: 'You are editing this Habit!',
                body: `This Habit spans from ${new Date(payload.createdAt).toLocaleString('default', {month: 'long', year: 'numeric', day:'numeric'})} to ${new Date(payload.dueDate).toLocaleString('default', {month: 'long', year: 'numeric', day:'numeric'})}`,
                callback1: () => {
                    setTasks(tasks.map((task) =>
                        task.id === payload.id ? {...payload, type: 'all'} : task
                    ));
                    callback();
                    resetConfirm();
                },
                callback2: () => {
                    setTasks(tasks.map((task) =>
                        task.id === payload.id ? {...payload, type: 'one'} : task
                    ));
                    callback();
                    resetConfirm();
                },
                close: resetConfirm
            }
        });

    };

    const updateTasks = ({payload, action}) => {
        if (action === "add"){
            setTasks(tasks.map((task) =>
                task.id === payload.id ? {...payload} : task
            ));
        }
        else if (action === "remove"){
            const callback = () => {
                setTasks(
                    tasks.filter((task) =>
                    task.id !== payload.id
                ));
                resetConfirm();
            };
            if(payload.type === 'one'){
                setDeletes(deletes.concat({id: payload.id, type: 'one'}));
                callback();
                return;
            }
            setComponentData({
                active: true,
                props: {
                    title: 'You are about to delete this Habit!',
                    body: `This Habit spans from ${new Date(payload.createdAt).toLocaleString('default', {month: 'long', year: 'numeric', day:'numeric'})} to ${new Date(payload.dueDate).toLocaleString('default', {month: 'long', year: 'numeric', day:'numeric'})}`,
                    callback1: () => {
                        setDeletes(deletes.concat({id: payload.id, type: 'all'}));
                        callback();
                    },
                    callback2: () => {
                        setDeletes(deletes.concat({id: payload.id, type: 'one'}));
                        callback();
                    },
                    close: resetConfirm
                }
            });
        }
    };
    
    const actionButtons = (
        <div className="buttons">
            <button className="button is-success" onClick={commitTask}>Save changes</button>
            <button className="button" onClick={close}>Cancel</button>
        </div>
    );

    const closeButton = (
        <button className="delete" aria-label="close" onClick={close}></button>
    );

    return (
        <Modal portalClass={'.modal-container'} title={"Habits for" + ` ${selectedDate.toLocaleString('default', {month: 'long', year: 'numeric', day:'numeric'})} `} close={close} actionButtons={onEdit || actionButtons} closeButton={closeButton}>
            {tasks.map((task) => {
                return <Task key={task.id} data={task} setData={updateTasks} onSubmit={onSubmit} setOnEdit={setOnEdit} onEdit={onEdit}/>;
            })}
            {componentData.active && React.createElement(confirmComponent, componentData.props)}
        </Modal>
    );
}

export default TaskList;

