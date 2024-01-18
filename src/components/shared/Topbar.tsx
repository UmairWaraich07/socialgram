import { Link, useNavigate } from "react-router-dom";
import { Logo } from ".";
import { Button } from "../ui/button";
import { INITIAL_USER, useUserContext } from "@/contexts/UserContext";
import authService from "@/appwrite/auth";
import Avatar from "./Avatar";

const Topbar = () => {
  const { setIsAuthenticated, setUserData, userData } = useUserContext();
  const navigate = useNavigate();

  const handleSignout = async () => {
    const session = await authService.logoutUser();
    if (session) {
      // clear the userContext
      setUserData(INITIAL_USER);
      setIsAuthenticated(false);
      navigate("/sign-in");
    }
  };
  return (
    <header className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>

        <div className="flex-center gap-4">
          <Button
            variant="ghost"
            className=" shad-button_ghost"
            onClick={handleSignout}
          >
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>

          <Link to={`/profile/${userData.id}`}>
            <Avatar
              fullname={userData.fullname}
              username={userData.username}
              profilePicture={userData.profilePicture}
              width={36}
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
