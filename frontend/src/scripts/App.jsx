import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import '../styles/App.css'
import TaskInput from '../components/TaskInput'
import Layout from '../views/Layout'
import TaskRecord from '../components/TaskRecord'
import ToDoList from '../components/ToDoList'
import Login from '../components/Login'
import Register from '../components/Register'
import ProtectedRoute from './ProtectedRoute'

function App() {
    return(
        <AuthProvider>
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route index element={<Login />} />
                    <Route path='/register' element={<Register />} />

                    <Route
                        path='/input-task'
                        element={
                            <ProtectedRoute>
                                <TaskInput />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/task-records'
                        element={
                            <ProtectedRoute>
                                <TaskRecord />                                
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/to-do-list'
                        element={
                            <ProtectedRoute>
                                <ToDoList />                            
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
        </AuthProvider>
    )   
}

export default App
