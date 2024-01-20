import authService from "@/appwrite/auth";
import { INITIAL_USER, UserContext } from "@/contexts/UserContext";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Bottombar, LeftSidebar, Topbar } from "./components/shared";
import { NewUserTypes } from "./types";

const RootLayout = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<NewUserTypes>(INITIAL_USER);
  console.log({ userData });
  useEffect(() => {
    try {
      const cookieFallback = localStorage.getItem("cookieFallback");
      if (
        cookieFallback === "[]" ||
        cookieFallback === null ||
        cookieFallback === undefined
      ) {
        navigate("/sign-in");
      }

      (async () => {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUserData({
            id: currentUser.$id,
            email: currentUser.email,
            username: currentUser.username,
            fullname: currentUser.fullname,
            profilePicture: currentUser.profilePicture,
            savedPosts: currentUser.savedPosts,
          });
          setIsAuthenticated(true);
        } else {
          setUserData(INITIAL_USER);
          setIsAuthenticated(false);
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
      <div className="w-full md:flex relative">
        <Topbar />
        <LeftSidebar />
        <main className="flex flex-1 h-full">
          <Outlet />
        </main>

        <Bottombar />
        <Toaster />
      </div>
    </UserContext.Provider>
  );
};

export default RootLayout;
