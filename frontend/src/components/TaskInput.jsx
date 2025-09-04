import { useState, useEffect } from 'react'
import '../styles/index.css'
import { useAuth } from "../scripts/AuthContext";





export default function(){    
    const { user, token, logout } = useAuth();
    let [taskName, setTaskName] = useState('')
    let [dueDatetime, setDueDatetime] = useState()
    let [logDatetime, setLogDatetime] = useState(new Date())

    let getCurrentDatetime = () => {
        // let nowLocal = new Date().toISOString().slice(0,16);
        let nowLocalInput = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0,16);
        console.log(nowLocalInput)
        return nowLocalInput
    }

    let setDueDateNow = (e) => {
        e.preventDefault()
        setDueDatetime(getCurrentDatetime());
        return
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setLogDatetime(getCurrentDatetime());
        }, 1000); // update every second

            return () => clearInterval(interval); // clean up on unmount
    }, []);

    let handleSubmit = async (e) => {        
        e.preventDefault();

        //Are you sure????????

        let formData = new FormData();
        formData.append('user_id', user.id)
        formData.append('name', taskName)
        formData.append('due_datetime', dueDatetime)
        formData.append('log_datetime', logDatetime)
        try{
            let response = await fetch('http://127.0.0.1:5000/api/log-tasks', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: formData
            })
            let data = await response.json()
            if (data.success) {
                setTaskName('')
                setDueDatetime('')
            }
        }      
        catch(error){
            console.error("Error: ", error)
        }
    }

    return(
        <form id="task-input-form" onSubmit={handleSubmit} method="post">
            <h1 className='varela-round'>New Task</h1>
            <input
                className='task-input'
                placeholder='Task Name'
                name='name'
                type='text'
                value={taskName}
                onChange={e => setTaskName(e.target.value)}
                required
            />
            <label>Due</label>
            <input
                className='task-input'
                name='dueDatetime'
                type='datetime-local'
                value={dueDatetime}
                onChange={e => setDueDatetime(e.target.value)}
                required
            />
            <label>Log</label>
            <input
                className='task-input'
                name='logDatetime'
                type='datetime-local'
                value={logDatetime}
                onChange={e => setLogDatetime(e.target.value)}
            />
            <input className='task-input-buttons' value={"Submit"} type="submit"></input>
            <input className='task-input-buttons' type='button' value={"Get Current Datetime"} onClick={setDueDateNow}></input>
        </form>
        
    )
}