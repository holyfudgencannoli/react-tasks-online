// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { isJwtExpired } from "./jwt.js";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token"); // or cookie

  if (!token || isJwtExpired(token)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
