import { useAuth } from "../scripts/AuthContext";
import { Button } from "@mui/joy";
import { useNavigate } from "react-router-dom";

export default function LogoutButton({ setOpen }) {
    const navigate = useNavigate();
    const { user, token, logout } = useAuth();

    const handleLogout = async () => {
        if (!token) return;
        

        try {
            const res = await fetch("http://10.0.0.45:5000/api/auth/logout", {
                method: "POST",
                headers : {
                    Authorization: `Bearer ${token}`
                },                
                credentials: "include"
            });
            if (!res.ok) throw new Error("Logout failed");
            
            logout()
            // alert('logout successful!')            
            setOpen(false)
            navigate("/");
        } catch (err) {
            console.error(err);
            alert("Error logging out");
        }
    };

    return (
        
        <Button variant="outlined" color="danger" onClick={handleLogout}>
            Logout
        </Button>
    );
}
