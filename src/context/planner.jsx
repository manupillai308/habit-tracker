import { createContext, useState } from "react";

const PlannerContext = createContext();

const createNewTask = () => {
    const now = new Date().toISOString()
    return {
        "id": null, 
        "participants": [],
        "title": "",
        "desc": "",
        "dueDate": now,
        "priority": null,
        "status": null,
        "labels": [],
        "createdAt": now,
        "updatedAt": now,
        "pts": 0,
        "repeat": {
            "frequency": "daily",
            "exceptions": {}
        },
    }
};

const isSameWeekday = (createdAtDate, targetDate) => {
    return createdAtDate.getDay() === targetDate.getDay();
};

const isSameDayOfMonth = (createdAtDate, targetDate) => {
    return createdAtDate.getDate() === targetDate.getDate();
};

const isSameMonthDay = (createdAtDate, targetDate) => {
    return (
        createdAtDate.getMonth() === targetDate.getMonth() &&
        createdAtDate.getDate() === targetDate.getDate()
    );
};

function Provider({ children }){
    const [db, setDB] = useState({
        "1":{
            "id": "1", 
            "participants": ["user1", "user2"],
            "title": "Make Bed",
            "desc": "get up and make bed",
            "dueDate": "2025-04-05T00:00:00.000Z",
            "priority": "high",
            "status": "in-progress",
            "labels": ["work", "urgent"],
            "createdAt": "2025-02-24T08:00:00.000Z",
            "updatedAt": "2025-02-24T10:30:00.000Z",
            "repeat": {
                "frequency": "daily",
                "exceptions": {
                  "2025-03-02": { "title": ":-P", "desc": "This is an edited task!" }
                }
            },
            "deleted": false,
            "pts": 10,
        },
        "2":{
            "id": "2", 
            "participants": ["user1"],
            "title": "Drink Water",
            "desc": "drink atleast 2 litres of water",
            "dueDate": "2025-03-15T00:00:00.000Z",
            "priority": "high",
            "status": "in-progress",
            "labels": ["work", "urgent"],
            "createdAt": "2025-02-24T08:00:00.000Z",
            "updatedAt": "2025-02-24T10:30:00.000Z",
            "repeat": {
                "frequency": "weekly",
                "exceptions": {}
            },
            "deleted": false,
            "pts": 5,
        }
    });
    const [userDB, setUserDB] = useState([
        {
            "id": "user1",
            "name": "Sambu",
            "createdAt": "2025-02-24T08:00:00.000Z",
            "updatedAt": "2025-02-24T10:30:00.000Z",
            "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=user1",
            "pts": 210
        },
        {
            "id": "user2",
            "name": "Manu",
            "createdAt": "2025-02-24T08:00:00.000Z",
            "updatedAt": "2025-02-24T10:30:00.000Z",
            "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=user2",
            "pts": 130,
        },
    ]);

    const getUserById = (id) => {
        return userDB.find((user) => user.id == id);
    };

    const getTaskByDate = (targetDate) => {
        const targetDateStr = targetDate.toISOString().split("T")[0];
        const filteredTask = Object.values(db).filter(task => {
            const createdAtDate = new Date(task.createdAt);
            createdAtDate.setHours(0,0,0,0);
            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0,0,0,0);

            if (!(createdAtDate <= targetDate && targetDate <= dueDate) || task.deleted) {
                return false;
            }
    
            if (task.repeat?.exceptions && task.repeat.exceptions[targetDateStr]) {
                if (task.repeat.exceptions[targetDateStr].deleted) {
                    return false;
                }
                return true;
            }
    
            if (task.repeat?.frequency) {
                switch (task.repeat.frequency) {
                    case "daily":
                        return true;
    
                    case "weekly":
                        return isSameWeekday(createdAtDate, targetDate);
    
                    case "monthly":
                        return isSameDayOfMonth(createdAtDate, targetDate);
    
                    case "yearly":
                        return isSameMonthDay(createdAtDate, targetDate);
                    default:
                        return false; // No valid repeat rule
                }
            }

            return true;
        }).map(task => {
            if (task.repeat?.exceptions && task.repeat.exceptions[targetDateStr]) {
                return { ...task, ...task.repeat.exceptions[targetDateStr], type: 'one'};
            }
            return {...task, type: 'all'};
        });
    
        return filteredTask;
    };

    const addTask = ({task}) => {
        const id = `${db.length+1}`;
        db[id] = {...task, id};
        setDB(db);
    };
    
    const saveTask = ({tasks, deletes, targetDate}) => {
        const targetDateStr = targetDate.toISOString().split("T")[0];
        // {id: payload.id, type: 'one'}
        for (const {id, type} of deletes){
            if(type == 'all'){
                db[id].deleted = true;
            }
            else{
                const exceptions = db[id].repeat.exceptions[targetDateStr] || {deleted: false};
                exceptions.deleted = true;
                db[id].repeat.exceptions[targetDateStr] = exceptions;
            }
        }
        for (const {type, ...task} of tasks){
            task.updatedAt = new Date().toISOString();
            if(type == 'all'){
                db[task.id] = task;
            }
            else{
                const exceptions = db[task.id].repeat.exceptions[targetDateStr] || {}
                db[task.id].repeat.exceptions[targetDateStr] = {...exceptions, title: task.title, desc: task.desc, participants: task.participants};
            }
        }
        setDB(db);
    };

    const valueToShare = {
        db,
        userDB,
        setDB,
        getTaskByDate,
        saveTask,
        getUserById,
        addTask
    };
    return (
        <PlannerContext.Provider value={valueToShare}>
            {children}
        </PlannerContext.Provider>
    );
};

export { Provider, createNewTask };
export default PlannerContext;