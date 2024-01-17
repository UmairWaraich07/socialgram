import React from "react";

export type registerUserTypes = {
  email: string;
  password: string;
  username: string;
  fullname: string;
};

export type loginUserTypes = {
  email: string;
  password: string;
};

export type createUserTypes = {
  fullname: string;
  username: string;
  email: string;
  id: string;
};

export type NewUserTypes = {
  id: string;
  username: string;
  email: string;
};

export type IUserContextTypes = {
  userData: NewUserTypes;
  isAuthenticated: boolean;
  setUserData: React.Dispatch<React.SetStateAction<NewUserTypes>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};
