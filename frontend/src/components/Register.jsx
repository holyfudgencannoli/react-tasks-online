import { Button, Input } from '@mui/joy';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export default function Register() {
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [password_confirm, setPasswordConfirm] = useState('')
    const [isAdmin, setIsAdmin] = useState('')
    const [message, setMessage] = useState("");

    const navigate = useNavigate();


    const handleRegister = async (e) => {
        e.preventDefault();

        setMessage("");

        const formData = new FormData()

        formData.append('email', email)
        formData.append('phone', phone)
        formData.append('username', username)
        formData.append('password', password)
        formData.append('is_admin', isAdmin)

        try {
        const response = await fetch("http://10.0.0.45:5000/api/auth/register", {
            method: "POST",
            credentials: 'include',
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            setMessage("✅ " + data.msg);
            setUsername("");
            setPassword("");
            navigate('/');
        } else {
            setMessage("❌ " + data.msg);
        }
        } catch (err) {
            console.error(err)
            setMessage("⚠️ Server error, try again later.");
        }
    };

    const handleBackClick = () => {
        navigate(-1, {credentials: 'include'}); // Navigates one step back in the history
    };

    return(
        <div id='signup-box'>
            <form method='POST' onSubmit={handleRegister}>
                <label className="login-input-label">Email</label>
                <Input
                    size='sm'
                    style={{ width:'66%' }}
                    type="email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full mt-1 p-2 border rounded"
                />
                <label className="login-input-label">Phone</label>
                <Input
                    size='sm'
                    style={{ width:'66%' }}
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full mt-1 p-2 border rounded"
                />
                <label className="login-input-label">Username*</label>
                <Input
                    size='sm'
                    style={{ width:'66%' }}
                    type="text"
                    name="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full mt-1 p-2 border rounded"
                />
                <label className="login-input-label">Password*</label>
                <Input
                    size='sm'
                    style={{ width:'66%' }}
                    type="password"
                    name="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full mt-1 p-2 border rounded"
                />
                <label className="login-input-label">Confirm Password*</label>
                <Input
                    size='sm'
                    style={{ width:'66%' }}
                    type="password"
                    name="password_confirm"
                    value={password_confirm}
                    onChange={e => setPasswordConfirm(e.target.value)}
                    className="w-full mt-1 p-2 border rounded"
                />
                <input type="text" name='isAdmin' value={isAdmin} onChange={e => setIsAdmin(e.target.value)} />
                <Button type='submit'>Submit</Button>
            </form>
            <Button 
                variant="outlined" // Or "contained", "text"
                startIcon={<ArrowBackIcon />} 
                onClick={handleBackClick}
            >
            Back
            </Button>
        </div>
    )
}
