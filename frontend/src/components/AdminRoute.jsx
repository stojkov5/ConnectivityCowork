import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AdminRoute = () => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn || !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
