import { IUserContextTypes } from "@/types/index";
import { createContext, useContext } from "react";

export const INITIAL_USER = {
  id: "",
  username: "",
  fullname: "",
  profilePicture: "",
  email: "",
  bio: "",
  savedPosts: [],
  followers: [],
  following: [],
};

const initialState = {
  isAuthenticated: false,
  userData: INITIAL_USER,
  setUserData: () => {},
  setIsAuthenticated: () => {},
  //TODO: add isLoading for good ui/ux
};

const UserContext = createContext<IUserContextTypes>(initialState);

export const useUserContext = () => {
  return useContext(UserContext);
};

export default UserContext;
