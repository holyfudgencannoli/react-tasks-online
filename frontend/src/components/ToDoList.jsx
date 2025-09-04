import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import '../styles/ToDoList.css'
import { useTheme, useMediaQuery } from '@mui/material';
import { useAuth } from "../scripts/AuthContext";




export default function () {
    const { user, token, logout } = useAuth();
    let [tasks, setTasks] = useState([])
    const [rowClasses, setRowClasses] = useState({});
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
            Width0 = 110;
            Width1 = 75;
            Width2 = 75;
            Width3 = 10;
            Width4 = 90;
        } else if (isSm) {
            Width0 = 150;
            Width1 = 100;
            Width2 = 100;
            Width3 = 150;
            Width4 = 100; 
        } else if (isMd) {
            Width0 = 200;
            Width1 = 175;
            Width2 = 175;
            Width3 = 150;
            Width4 = 150; // wider bars on big screens
        } else if (isLg) {
            Width0 = 300;
            Width1 = 250;
            Width2 = 250;
            Width3 = 150;
            Width4 = 200; // wider bars on big screens
        } else if (isXl) {
            Width0 = 420;
            Width1 = 330;
            Width2 = 330;
            Width3 = 150;
            Width4 = 240; // wider bars on big screens
        }
    



    useEffect(() => {
        document.body.classList.add("page-loading");

        // optional: remove after animation so it doesn’t replay later
        const timer = setTimeout(() => {
            document.body.classList.remove("page-loading");
        }, 3200); // match animation duration

        return () => clearTimeout(timer);
    }, []);
    

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/get-tasks-to-do', {
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        })
        .then(res => {
            if(!res.ok) {
                throw new Error('Failed to fetch tasks')
            }
            if (res.status === 401) {
                window.location.href = '/';
            } else {
                return res.json()
            }
        })
        .then(data => {
            if (!data.tasks) {
                alert("No tasks found!");
            } else {
                setTasks(data.tasks);
            }
        })
        .catch(err => {
            console.error("Error fetching tasks:", err);
            alert("Error loading tasks");
        })
    }, [])


    const addRowClass = (rowId, className, duration = null) => {
        setRowClasses(prev => ({
            ...prev,
            [rowId]: [...(prev[rowId] || []), className]
        }));

        if (duration) {
            setTimeout(() => {
                setRowClasses(prev => ({
                    ...prev,
                    [rowId]: (prev[rowId] || []).filter(c => c !== className)
                }));
            }, duration);
        }
    };

    
    const markComplete = async(row) => {
        const taskId = row.id
        await fetch(`http://127.0.0.1:5000/api/mark-complete`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({'task_id': taskId})
        });
    }

    const handleComplete = async (row) => {
        addRowClass(row.id, 'new-completed', 3200)

        
        setTimeout(() => {
            markComplete(row)
        }, 3200);


        // window.location.reload()
        
        setTasks((prev) =>
            prev.map((t) =>
                t.id === row.id ? { ...t, completed: true } : t
            )
        );

    };


    
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
        completed: task.completed,
    }))


    const columns = [
        { field: 'name', headerName: 'Name', width: Width0 },
        { field: 'dueDatetime', headerName: 'Due', width: Width1 },
        { field: 'logDatetime', headerName: 'Log', width: Width2 },
        {
            field: 'action',
            headerName: 'Done',
            width: Width4,
            renderCell: (params) => {
                return(
                    <button
                        onClick={() => handleComplete(params.row)}
                    >
                        Done
                    </button>
                )},
        },
    ];

    return(
        <>
            <h1>ToDoList!</h1>
            <div style={{ height: 300, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    disableColumnResize
                    getRowClassName={(params) => {
                        const row = params.row
                        const baseClass = 'strike-row';
                        const custom = rowClasses[params.row.id]?.join(' ') || '';
                        return `${baseClass} ${custom} ${params.row.completed ? 'completed' : ''}`;
                    }}
                />

            </div>
        </>
    )
    
}