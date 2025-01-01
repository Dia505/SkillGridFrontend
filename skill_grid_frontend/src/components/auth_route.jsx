import { Navigate } from "react-router-dom";

const AuthRoute = ({ element, requiredRole }) => {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");

  // If no token or role doesn't match, redirect to the login page
  if (!token || role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default AuthRoute;
