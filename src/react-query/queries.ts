import { loginUserTypes, registerUserTypes } from "@/appwrite/appwrite.types";
import authService from "@/appwrite/auth";
import { useMutation } from "@tanstack/react-query";

// ** AUTH QUERIES ** //
export const useRegisterUser = () => {
  return useMutation({
    mutationFn: ({ email, password, username, fullname }: registerUserTypes) =>
      authService.registerUser({
        email,
        password,
        username,
        fullname,
      }),
  });
};

export const useLoginUser = () => {
  return useMutation({
    mutationFn: ({ email, password }: loginUserTypes) =>
      authService.loginUser({ email, password }),
  });
};

export const useLogoutUser = () => {
  return useMutation({
    mutationFn: authService.logoutUser,
  });
};
