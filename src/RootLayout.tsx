import authService from "@/appwrite/auth";
import { INITIAL_USER, UserContext } from "@/contexts/UserContext";
import { Suspense, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Bottombar, LeftSidebar, Logo, Topbar } from "./components/shared";
import { NewUserTypes } from "./types";
import { Loader } from "./components/Icons";
import Loading from "./components/shared/Loading";

const RootLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<NewUserTypes>(INITIAL_USER);
  console.log({ userData });

  useEffect(() => {
    setIsLoading(true);
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
            bio: currentUser.bio,
            savedPosts: currentUser.savedPosts,
            followers: currentUser.followers,
            following: currentUser.following,
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
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  return isLoading ? (
    <div className="h-screen max-sm:h-[70vh] w-full flex-center relative">
      <Loader width={64} height={64} />
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Logo />
      </div>
    </div>
  ) : (
    <UserContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, userData, setUserData }}
    >
      <div className="w-full md:flex relative ">
        <Topbar />
        <LeftSidebar />
        <main className="flex flex-1 h-full ">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </main>

        <Bottombar />
        <Toaster theme="dark" />
      </div>
    </UserContext.Provider>
  );
};

export default RootLayout;
