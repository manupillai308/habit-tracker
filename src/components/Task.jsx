import useDBContext from '../hooks/use-db-context.js';
import React, { useState } from 'react';

function Task({ data, setData, onSubmit, setOnEdit, onEdit}){

    const [isEdit, setEdit] = useState(false);
    const [isOpen, setOpen] = useState(false);
    const { userDB, getUserById } = useDBContext();
    const [discardData, setDiscardData] = useState(null);

    const discard = () => {
        setData({payload: discardData, action:'add'});
        setDiscardData(null);
        setEdit(false);
        setOnEdit(false);
    };
    const doEdit = () => {
        setDiscardData(data);
        setEdit(true);
        setOnEdit(true);
    };

    const saveEdit = () => {
        onSubmit({payload: data, callback: () => setEdit(false)});
        setOnEdit(false);
    };

    const setPs = (ps) => {
        setData({payload: {...data, participants: ps}, action:'add'});
    };

    const setHeader = (header) => {
        setData({payload: {...data, title: header}, action:'add'});
    };

    const setBody = (body) => {
        setData({payload: {...data, desc: body}, action:'add'});
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

    const removeTasks = () => {
        setData({payload: data, action:"remove"});
    }

    const handleChange = (event) => {
        if (event.target.name == 'header') setHeader(event.target.value);
        else if (event.target.name == 'body') if (event.target.value.length <= 40) setBody(event.target.value);
    };


    const assignees = data.participants.map((user_id) => {
        const user = getUserById(user_id);
        if(user){
            return <span key={user.id} className="tag is-hoverable is-primary is-medium">
            {user.name}
            {isEdit ? <button onClick={() => removeParticipant(user.id)} className="delete is-small"></button> : null}
        </span>
        }
    });
    return (
        <div className='p-3 pl-4 pr-4 mb-2 shadow-md'>
            <div className="is-flex is-justify-content-space-between">
                {
                isEdit ? 
                    <div>
                        <p><input name='header' value={data.title} onChange={handleChange} className='title is-size-5 pb-1'/></p>
                        <p><input name='body' value={data.desc} onChange={handleChange} className='subtitle is-size-6' style={{"width": "20rem"}}/></p>
                    </div> : 
                    <div>
                        <p className='title is-size-5 pb-1'>{data.title} ({data.pts}<span className="icon" style={{color: '#FFD700'}}>
                                <i className="fas fa-star fa-xs"></i>
                            </span>)</p>
                        <p className='subtitle is-size-6'>{data.desc}</p>
                    </div>
                }
                <div className='is-flex is-align-items-center buttons'>
                    <div>
                        {isEdit ? 
                            <button onClick={saveEdit} className="button is-primary">
                                <span className="icon is-small">
                                <i className="fas fa-check"></i>
                                </span>
                            </button>
                            :
                            <button disabled={onEdit} onClick={doEdit} className="button is-primary">
                                <span className="icon is-small">
                                <i className="fas fa-pen"></i>
                                </span>
                            </button>
                        }
                    </div>
                    <div>
                        {isEdit ? 
                            <button onClick={discard} className="button is-danger">
                                <span className="icon is-small">
                                <i className="fas fa-xmark"></i>
                                </span>
                            </button>
                            // null
                         :
                            <button disabled={onEdit} onClick={removeTasks} className="button is-danger">
                                <span className="icon is-small">
                                <i className="fas fa-trash"></i>
                                </span>
                            </button>
                        }
                    </div>
                </div>
            </div>
            <div className='pt-2'>
                <div className="tags are-medium">
                    Assignees: {assignees}
                    {isEdit ?
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
                        :
                        null
                    }
                </div>
            </div>
        </div>
    );
}

export default Task;