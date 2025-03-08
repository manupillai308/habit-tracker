import React, { useState } from 'react';
import Modal from './Modal.jsx';
import User from './User.jsx';
import useDBContext from '../hooks/use-db-context.js';
import { createNewUser, getRandomAvatar } from '../context/planner.jsx';

function confirmComponent({callback1, callback2, title, body, close}){
    return (
    <Modal portalClass={'.modal-re-assure'} title={title}
        actionButtons={(
            <div className="buttons">
                <button className="button is-danger" onClick={callback1}>Delete</button>
                <button className="button i" onClick={callback2}>Go Back</button>
            </div>)} closeButton={<button className="delete" aria-label="close" onClick={close}></button>}>
        {body}
    </Modal>
);
}

function Panel ({selectedDate, showUser}){
    const [query, setQuery] = useState('');
    const { userDB, addUser, deleteUser } = useDBContext();
    const [userData, setUserData] = useState('');
    const [isOpen, setOpen] = useState(false);
    const [componentData, setComponentData] = useState({
            active: false,
            props: {}
    });

    const resetConfirm = () => {
        setComponentData({
            active: false,
            props: {}
        })
    };

    const handleUserAdd = (open) =>{
        if(open){
            setUserData(createNewUser());
            setOpen(true);
        }
        else{
            addUser({user: userData});
            setOpen(false);
        }
        
    };

    const handleUserDelete = ({id, name}) =>{
        setComponentData({
            active: true,
            props: {
                title: 'Wait!!',
                body: `You are about to delete user ${name}. This action cannot be undone!`,
                callback1: () => {
                    deleteUser({user: {id}});
                    resetConfirm();
                },
                callback2: () => {
                    resetConfirm();
                },
                close: resetConfirm
            }
        });

    };

    const changeAvatar = () =>{
        setUserData({...userData, avatar: getRandomAvatar()});
    };
    const setUserName = (name) => {
        if(name.length < 10) setUserData({...userData, name});
    };

    const onUserChange = (event) =>{
        if(event.target.name == 'username') setUserName(event.target.value);
    }

    const users = userDB.sort((a, b) => b.pts - a.pts).map((val, index) => (
       {...val, rank: index+1}
    ));
    
    const filteredUsers = users.filter((user) => (query == '' || user.name.toLowerCase().includes(query.toLowerCase())));
    return (
        <div className='has-border-sm card' style={{overflow: 'hidden'}}>
            <div className='has-text-centered is-size-4 has-background-primary p-2 mb-2'>Ranklist</div>
            <div className="field">
                <p className="control has-icons-left pl-4 pr-4 is-flex">
                    <span className='icon'>
                        <i className="fas fa-search"></i>
                    </span>
                    <input onChange={(e) => setQuery(e.target.value)} className="input" value={query} type="text" placeholder="Looking for some1?"/>
                    <button onClick={() => handleUserAdd(!isOpen)} className="button is-primary ml-1">
                        <i className={`fas fa-${isOpen ? 'check':'plus'}`}></i>
                    </button>
                </p>
            </div>
            <div className="scroll box" style={{overflowY: 'auto', height: '50vh'}}>
                {isOpen ? 
                    <div className="pl-1 pr-1 mb-2 has-border-sm is-flex is-justify-content-space-between">
                        <div className="card-content p-2">
                            <div className="media">
                            <div className="media-left">
                                <figure className="parent image is-48x48" style={{position: 'relative'}}>
                                <img
                                    src={userData.avatar}
                                    alt="avatar"
                                />
                                <i style={
                                    {
                                        position: 'absolute', 
                                        top: '50%', 
                                        left: '50%', 
                                        transform: 'translate(-50%, -50%)',
                                        background: 'rgba(255, 255, 255, 0.3)'
                                    }} className="child is-size-3 fa-solid fa-arrows-rotate has-text-grey p-1" onClick={changeAvatar}></i>
                                </figure>
                            </div>
                            <div className="scroll media-content">
                                <input name='username' style={{maxWidth: '8rem'}}className="has-text-weight-semibold is-size-5" value={userData.name} onChange={onUserChange} placeholder='name..?'/>
                                <p className="subtitle is-6">{userData.pts} <span className="icon" style={{color: '#FFD700'}}>
                                            <i className="fas fa-star"></i>
                                </span></p>
                            </div>
                            </div>
                        </div>
                    </div>
                    :
                    null
                }
                {
                    filteredUsers.map((val, index) => (
                        <User key={val.id} user={val} handleUserDelete={handleUserDelete} handleView={() => showUser(val.id)}/>
                    ))
                }
            </div>
            {componentData.active && React.createElement(confirmComponent, componentData.props)}
        </div>
    );
}

export default Panel;