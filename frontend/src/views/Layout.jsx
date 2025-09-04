import { useState, useEffect } from 'react'
import '../styles/App.css'
import { useNavigate, Outlet } from 'react-router-dom'
import TaskInput from '../components/TaskInput'
import TaskRecord from '../components/TaskRecord'

export default function() {
    let [message, setMessage] = useState('')
    let navigate = useNavigate() 
    
    return (
        <>
        <div id='buttons'>
            <a href="/"><button>Home</button></a>
            <a href="/task-records"><button>Records</button></a>
            <a href="/to-do-list"><button>To Do List</button></a>
        </div>
            <Outlet />
        </>
    )

    
}