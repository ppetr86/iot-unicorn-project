import { useContext, useEffect } from "react";
import { LoginContext } from "../context/loginContext";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function LogoutPage() {
  const queryClient = useQueryClient();
  const { logout } = useContext(LoginContext);
  const navigateTo = useNavigate();

  useEffect(() => {
    logout(), queryClient.removeQueries();
    // Add a 2-second delay before calling logout and redirecting
    const delay = 2000; // 2 seconds in milliseconds
    const timer = setTimeout(() => {
      navigateTo("/");
    }, delay);

    // Cleanup the timer to prevent any unexpected behavior
    return () => clearTimeout(timer);
  }, [logout, queryClient, navigateTo]);

  return (
    <>
      <h1>Logout...</h1>
    </>
  );
}

export default LogoutPage;
