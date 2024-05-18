import React from "react";
import { Navigate } from "react-router-dom"; 
import { useAuth } from "./AuthContext";


const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        console.log("No user found, redirecting to auth");
        return <Navigate to="/authentification" replace />;
    }

   
    const isAllowed = user.role.some(role => allowedRoles.includes(role));
     console.log("succee")
    console.log(isAllowed)
    console.log("succee")

    if (!isAllowed) {
        console.log("User role not allowed, redirecting");
        return <Navigate to="/not-found" replace />;
    }

    return children;
};
export default RoleProtectedRoute;
