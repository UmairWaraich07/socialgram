import authService from "@/appwrite/auth";
import { INITIAL_USER, UserContext } from "@/contexts/userContext";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const RootLayout = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(INITIAL_USER);

  useEffect(() => {
    try {
      const cookieFallback = localStorage.getItem("cookieFallback");
      if (!cookieFallback) navigate("/sign-in");

      (async () => {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUserData({
            id: currentUser.$id,
            username: currentUser.name,
            email: currentUser.email,
          });
          setIsAuthenticated(true);
        } else {
          toast("Login failed. Try again");
        }
      })();
    } catch (error) {
      console.log(
        `Error on getting the current logged in user :: APPWRITE :: ${error}`
      );
      throw new Error((error as Error).message);
    }
  }, [navigate]);

  if (!isAuthenticated) navigate("/sign-in");

  return (
    <UserContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, userData, setUserData }}
    >
      <h1 className="underline">Root Layout</h1>
      <Outlet />
    </UserContext.Provider>
  );
};

export default RootLayout;
