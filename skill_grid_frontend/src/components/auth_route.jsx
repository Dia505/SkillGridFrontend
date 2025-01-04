import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth_context";

const AuthRoute = ({ element, requiredRole }) => {
  const { authToken, role } = useAuth(); // Consistent with AuthContext

  // If no token or role doesn't match, redirect to the login page
  if (!authToken || role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default AuthRoute;
