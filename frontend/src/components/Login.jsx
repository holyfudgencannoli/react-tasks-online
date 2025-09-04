import React, { useState } from "react";
import { useAuth } from "../scripts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  

  const passwordResetRedirect = () => {
    navigate("/forgot-password");
  };

  const registrationRedirect = () => {
    navigate("/register");
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // stop page reload

    try {
      const res = await fetch("http://10.0.0.45:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        const token = data.access_token;
        const user = data.user;
        login(user, token)
        navigate("/input-task");
      } else {
        alert(data.msg || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <>
    <form
      onSubmit={handleLogin}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "66%",
        margin: "50px auto",
      }}
    >
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px" }}
      />
      <button type="submit">Login</button>
      
    </form>
    <div id="login-links">
      <a onClick={registrationRedirect}><button>Forgot password?</button></a>
      <a onClick={registrationRedirect}><button>Create a new account</button></a>
    </div>
    </>
  );
}
