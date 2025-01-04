import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || null);
    const [role, setRole] = useState(null); // Role is managed in memory

    const login = (token, userRole) => {
        setAuthToken(token);
        setRole(userRole);
        localStorage.setItem("authToken", token);
    };

    const logout = () => {
        setAuthToken(null);
        setRole(null);
        localStorage.removeItem("authToken");
    };

    return (
        <AuthContext.Provider value={{ authToken, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
