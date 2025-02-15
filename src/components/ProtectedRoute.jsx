import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({element, requiredRole }) => {
    const [role, setRole] = useState(localStorage.getItem("role") || "")
    const token = localStorage.getItem("token")

    useEffect(() => {
        const updateRole = () => setRole(localStorage.getItem("role") || "")
        window.addEventListener("storage", updateRole)
        return () => window.removeEventListener ("storage", updateRole);
    }, []);

    console.log("skyddad route -hämtad roll", role);

    if(!token) {
        console.warn("ingen token, omdirigerar till login")
        return <Navigate to="/" replace />
    }

    if (requiredRole && role !== requiredRole) {
        console.warn("obehörig roll, omdirigerar")
        return <Navigate to="/" replace />
    }

    return element;
}
 
export default ProtectedRoute;