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
};

const initialState = {
  isAuthenticated: false,
  userData: INITIAL_USER,
  setUserData: () => {},
  setIsAuthenticated: () => {},
  //TODO: add isLoading for good ui/ux
};

export const UserContext = createContext<IUserContextTypes>(initialState);

export const useUserContext = () => {
  return useContext(UserContext);
};
