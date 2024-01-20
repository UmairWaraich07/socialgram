import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Logo } from ".";
import { INITIAL_USER, useUserContext } from "@/contexts/UserContext";
import Avatar from "./Avatar";
import { LeftbarLinks } from "@/constants";
import { Button } from "../ui/button";
import authService from "@/appwrite/auth";
import { NavLinkTypes } from "@/types";

const LeftSidebar = () => {
  const { userData, setUserData, setIsAuthenticated } = useUserContext();
  const { pathname } = useLocation();
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
    <aside className="leftsidebar overflow-y-auto custom-scrollbar gap-14">
      <div className="flex flex-col gap-11">
        <Link to="/">
          <Logo width={170} />
        </Link>

        <Link
          to={`/profile/${userData.id}`}
          className="flex items-center gap-3 "
        >
          <Avatar
            fullname={userData.fullname}
            username={userData.username}
            profilePicture={userData.profilePicture}
            width={60}
          />
          <div className="flex flex-col">
            <h4 className="body-bold">{userData.fullname}</h4>
            <p className="small-regular">@{userData.username}</p>
          </div>
        </Link>

        <nav className="flex flex-col gap-5">
          {LeftbarLinks.map((link: NavLinkTypes) => {
            const isActive = pathname === link.route;
            return (
              <NavLink
                to={link.route}
                key={link.route}
                className={`leftsidebar-link group flex gap-4 items-center p-4 ${
                  isActive && "bg-primary-500"
                }`}
              >
                <img
                  src={link.imgURL}
                  className={`group-hover:invert-white ${
                    isActive && "invert-white"
                  }`}
                  alt={link.label}
                />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={handleSignout}
      >
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium cursor-pointer">Logout</p>
      </Button>
    </aside>
  );
};

export default LeftSidebar;
