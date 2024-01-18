import {
  CreatePostTypes,
  loginUserTypes,
  registerUserTypes,
} from "@/types/index";
import authService from "@/appwrite/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import configService from "@/appwrite/config";
import { QUERY_KEYS } from "./queryKeys";

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

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePostTypes) => configService.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: configService.getRecentPosts,
  });
};
