import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initialize state from localStorage, parsing the JSON object
    const savedAuthData = JSON.parse(localStorage.getItem("authData")) || { token: null, role: null };
    const [authToken, setAuthToken] = useState(savedAuthData.token);
    const [role, setRole] = useState(savedAuthData.role);

    const login = (token, userRole) => {
        const authData = { token, role: userRole };
        setAuthToken(token);
        setRole(userRole);
        localStorage.setItem("authData", JSON.stringify(authData));  // Save both token and role as JSON
    };

    const logout = () => {
        setAuthToken(null);
        setRole(null);
        localStorage.removeItem("authData");  // Remove the object from localStorage
    };

    return (
        <AuthContext.Provider value={{ authToken, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
