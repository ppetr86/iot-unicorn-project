import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "../../context/loginContext";

export const ProtectedRoute = ({ children, redirectTo = "/" }) => {
  const { isLoggedIn } = useContext(LoginContext);
  if (!isLoggedIn) {
    return <Navigate to={redirectTo} />;
  } else {
    return children ? children : <Outlet />;
  }
};
