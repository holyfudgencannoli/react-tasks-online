import { useState, useEffect } from 'react'
import DatePicker from "react-datepicker";
import { DataGrid, gridColumnDefinitionsSelector } from '@mui/x-data-grid';
import "react-datepicker/dist/react-datepicker.css";
import { useTheme, useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import { useAuth } from "../scripts/AuthContext";



export default function() { 
    const { user, token, logout } = useAuth();
    const theme = useTheme();

    const isXs = useMediaQuery(theme.breakpoints.down('sm'));     // <600px
    const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600–900px
    const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg')); // 900–1200px
    const isLg = useMediaQuery(theme.breakpoints.between('lg', 'xl')); // 900–1200px
    const isXl = useMediaQuery(theme.breakpoints.up('xl'));    
    
    // Adjust column widths (or gaps) per breakpoint
    let Width0;
    let Width1;
    let Width2;
    let Width3;
    let Width4;
    if (isXs) {
        Width0 = 100;
        Width1 = 75;
        Width2 = 75;
        Width3 = 10;
        Width4 = 100;
    } else if (isSm) {
        Width0 = 100;
        Width1 = 100;
        Width2 = 100;
        Width3 = 150;
        Width4 = 150; 
    } else if (isMd) {
        Width0 = 200;
        Width1 = 150;
        Width2 = 150;
        Width3 = 150;
        Width4 = 200; // wider bars on big screens
    } else if (isLg) {
        Width0 = 300;
        Width1 = 200;
        Width2 = 200;
        Width3 = 150;
        Width4 = 300; // wider bars on big screens
    } else if (isXl) {
        Width0 = 390;
        Width1 = 330;
        Width2 = 330;
        Width3 = 150;
        Width4 = 270; // wider bars on big screens
    }





    let [tasks, setTasks] = useState([])
    let [date, setDate] = useState(new Date())

    

    async function getDaysTasks() {
        let isoString = date.toISOString().slice(0, 10);
        try {
            let res = await fetch('http://127.0.0.1:5000/api/get-tasks', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({'date': isoString})
            });

            let data = await res.json();
            console.log(data)

            if (!data.tasks || data.tasks.length === 0) {
                console.log("No tasks found!");
                setTasks([])
            } else {
                setTasks(data.tasks);
            }

        } catch (err) {
            console.error("Error fetching tasks:", err);
            alert("Error loading tasks");
        }
    };

    let formattedDate = (date) => {
        let fd = new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        })
        return fd
    };

    let formattedTime = (date) =>{
        let ft = new Date(date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
        })
        return ft
    };
    
    
    useEffect(() => {
        let fetchTasks = async () => {
            let isoString = date.toISOString().slice(0, 10);
            try {
                let res = await fetch('http://127.0.0.1:5000/api/get-tasks', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({'date': isoString})
                });
    
                let data = await res.json();
                console.log(data)

                if (!data.tasks || data.tasks.length === 0) {
                    console.log("No tasks found!");
                } else {
                    setTasks(data.tasks);
                }

            } catch (err) {
                console.error("Error fetching tasks:", err);
                alert("Error loading tasks");
            }
        };
        fetchTasks();
    }, [date]);

    
    const columns = [
        { field: 'name', headerName: 'Task Name' , width: Width0},
        { field: 'dueDatetime', headerName: 'Due Date' , width: Width1},
        { field: 'logDatetime', headerName: 'Log Date', width: Width2},
        { field: 'completionTime', headerName: 'Completion Time', width: Width4},
    ];
    const rows = tasks.map((task) => ({
        id: task.id,
        name: task.name,
        dueDatetime: new Date(task.due_datetime).toLocaleString("en-GB", {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }),
        logDatetime: new Date(task.log_datetime).toLocaleString("en-GB", {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }),
        completionTime: task.fin_datetime ? new Date(task.fin_datetime).toLocaleString("en-GB", {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            weekday: 'short',
            hour12: true,
        }) : 'Not completed yet',
    }))


    return(
        <div id="" className="card">
            <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                // onSelect={null}
            />
            <button onClick={getDaysTasks}>Get Day's Tasks</button>

            {tasks.length > 0 ? (
            <>
            <div className='chart-container'>
                <DataGrid rows={rows} columns={columns} disableColumnResize={true}/>
            </div>
            </>
            ) : (
            <p>No Tasks Yet!</p>
            )}
        </div>)
}