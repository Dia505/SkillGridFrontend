import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initialize state from localStorage, parsing the JSON object
    const savedAuthData = JSON.parse(localStorage.getItem("authData")) || { token: null, role: null, userId: null };
    const [authToken, setAuthToken] = useState(savedAuthData.token);
    const [role, setRole] = useState(savedAuthData.role);
    const [userId, setUserId] = useState(savedAuthData.userId);

    const login = (token, userRole, userId) => {
        const authData = { token, role: userRole, userId }; 
        setAuthToken(token);
        setRole(userRole);
        setUserId(userId);
        localStorage.setItem("authData", JSON.stringify(authData));  
    };

    const logout = () => {
        setAuthToken(null);
        setRole(null);
        setUserId(null);
        localStorage.removeItem("authData");  // Remove the object from localStorage
    };

    return (
        <AuthContext.Provider value={{ authToken, role, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
