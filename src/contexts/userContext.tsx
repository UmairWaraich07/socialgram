import { IUserContextTypes } from "@/types/index";
import { createContext, useContext } from "react";

export const INITIAL_USER = {
  id: "",
  username: "",
  email: "",
};

const initialState = {
  isAuthenticated: false,
  userData: INITIAL_USER,
  setUserData: () => {},
  setIsAuthenticated: () => {},
};

export const UserContext = createContext<IUserContextTypes>(initialState);

export const useUserContext = () => {
  return useContext(UserContext);
};
