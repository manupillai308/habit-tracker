import { useState } from 'react';
import User from './User.jsx';
import useDBContext from '../hooks/use-db-context.js';

function Panel ({selectedDate}){
    const [query, setQuery] = useState('');
    const { userDB } = useDBContext();

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
                    <input onChange={(e) => setQuery(e.target.value)} className="input" value={query} type="text" placeholder="Search participant..."/>
                </p>
            </div>
            <div className="scroll box" style={{overflowY: 'auto', height: '50vh'}}>
                {/* {selectedDate.toLocaleDateString()} */}
                {
                    filteredUsers.map((val, index) => (
                        <User key={val.id} user={val}/>
                    ))
                }
            </div>
        </div>
    );
}

export default Panel;