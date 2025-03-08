import { createContext, useEffect, useState } from "react";
import { openDB } from 'idb';

const PlannerContext = createContext();

const DB_NAME = "habitTrackerDB";
const DB_VERSION = 1;

function getRandomAvatar(length) {
    const seed = [...Array(length)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");

    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
}

const createNewUser = () => {

    const now = new Date().toISOString()
    return {
        "id": null,
        "name": "",
        "createdAt": now,
        "updatedAt": now,
        "avatar": getRandomAvatar(),
        "pts": 0,
        "completed": {}
    }
};

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
    const [db, setDB] = useState({});
    const [userDB, setUserDB] = useState([]);

    useEffect(() => {
        const initDB = async () => {
            const database = await openDB(DB_NAME, DB_VERSION, {
                upgrade(db) {
                    if (!db.objectStoreNames.contains("tasks")){
                        db.createObjectStore("tasks", {keyPath: "id", autoIncrement: true});
                    }
                    if (!db.objectStoreNames.contains("users")){
                        db.createObjectStore("users", {keyPath: "id", autoIncrement: true});
                    }
                },
            });

            await loadData(database);
        };
        initDB();
    }, []);

    const loadData = async (database) => {
        const tx = database.transaction(["tasks", "users"], "readonly");
        const taskStore = tx.objectStore("tasks");
        const userStore = tx.objectStore("users");

        const allTasks = await taskStore.getAll();
        const allUsers = await userStore.getAll();

        setDB(allTasks.reduce((acc, task) => ({...acc, [task.id]: task}), {}));
        setUserDB(allUsers);
        
        await tx.done;
    };

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

    const addTask = async ({task}) => {
        const database = await openDB(DB_NAME, DB_VERSION);
        const tx = database.transaction("tasks", "readwrite");
        const store = tx.objectStore("tasks");
        delete task.id;

        const id = await store.put(task);
        task.id = id; 

        setDB((prev) => ({ ...prev, [id]: task }));
    };
    
    const addUser = async ({user}) => {
        const database = await openDB(DB_NAME, DB_VERSION);
        const tx = database.transaction("users", "readwrite");
        const store = tx.objectStore("users");

        delete user.id;
        const id = await store.put(user);
        user.id = id;

        setUserDB((prev) => [...prev, user]);
    };

    const updateUser = async ({user}) => {
        const database = await openDB(DB_NAME, DB_VERSION);
        const tx = database.transaction("users", "readwrite");
        const store = tx.objectStore("users");

        await store.put(user);
        await tx.done;

        setUserDB((prev) => prev.map((u) => (u.id === user.id ? user : u)));
    };

    const deleteUser = async ({user}) => {
        const database = await openDB(DB_NAME, DB_VERSION);
        const tx = database.transaction("users", "readwrite");
        const store = tx.objectStore("users");

        await store.delete(user.id);
        await tx.done;

        setUserDB((prev) => prev.filter((u) => u.id !== user.id));
    };
    
    const saveTask = async ({tasks, deletes, targetDate}) => {
        const targetDateStr = targetDate.toISOString().split("T")[0];
        const database = await openDB(DB_NAME, DB_VERSION);
        const tx = database.transaction("tasks", "readwrite");
        const store = tx.objectStore("tasks");
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
            await store.put(db[id]);
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
            await store.put(db[task.id]);
        }
        await tx.done;
        setDB({ ...db });
    };

    const valueToShare = {
        db,
        userDB,
        setDB,
        getTaskByDate,
        saveTask,
        getUserById,
        addTask,
        createNewUser,
        addUser,
        deleteUser,
        updateUser
    };
    return (
        <PlannerContext.Provider value={valueToShare}>
            {children}
        </PlannerContext.Provider>
    );
};

export { Provider, createNewTask, createNewUser, getRandomAvatar };
export default PlannerContext;