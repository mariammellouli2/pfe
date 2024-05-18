import React, { createContext, useContext, useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { callMsGraph } from "./graph";

const AuthContext = createContext({ user: null, login: () => {}, logout: () => {}, loading: false, error: null });

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("currentUser");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { instance, accounts } = useMsal();

    useEffect(() => {
        if (accounts.length > 0) {
            setLoading(true);
            instance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            }).then(async (response) => {
                const graphUser = await callMsGraph(response.accessToken);
                const email = graphUser.mail || graphUser.userPrincipalName;
                
                const userRole = await fetchUserRole(email);
                
                const currentUser = {
                    username: email,
                    name: graphUser.displayName,
                    role: userRole,
                    id: email,
                };

                setUser(currentUser);
                localStorage.setItem("currentUser", JSON.stringify(currentUser));
            }).catch((err) => {
                setUser(null);
                localStorage.removeItem("currentUser");
                setError(err.message || "Failed to login");
            }).finally(() => {
                setLoading(false);
            });
        } else {
            setUser(null);
            setError("No account is currently signed in.");
        }
    }, [accounts, instance]);

    const fetchUserRole = async (email) => {
        const url = `https://localhost:44352/api/Users/getRoleByUserEmail?email=${encodeURIComponent(email)}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP status ${response.status}`);
            }
            const data = await response.json();
            return data.role;
        } catch (error) {
            return 'collaborateur'; 
        }
    };

    const login = (userInfo) => {
        setUser(userInfo);
        localStorage.setItem("currentUser", JSON.stringify(userInfo));
    };

    const logout = () => {
        instance.logoutPopup().then(() => {
            setUser(null);
            localStorage.removeItem("currentUser");
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
