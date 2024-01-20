import {
  CreatePostTypes,
  LikePostTypes,
  SavePostTypes,
  loginUserTypes,
  registerUserTypes,
} from "@/types/index";
import authService from "@/appwrite/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import configService from "@/appwrite/config";

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
    queryFn: async () => {
      return await configService.getRecentPosts();
    },
  });
};

export const useGetPostLikes = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_LIKES, postId],
    queryFn: () => configService.getLikes(postId),
  });
};

export const useCheckLiked = ({ postId, userId }: LikePostTypes) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CHECK_LIKED, postId, userId],
    queryFn: () => configService.checkLiked({ postId, userId }),
  });
};

export const useAddLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, userId }: LikePostTypes) =>
      configService.addLike({ postId, userId }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_LIKES, variables.postId],
      });
    },
  });
};

export const useDeleteLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, userId }: LikePostTypes) =>
      configService.deleteLike({ postId, userId }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_LIKES, variables.postId],
      });
    },
  });
};

export const useAddToSaved = () => {
  return useMutation({
    mutationFn: ({ userId, postId, savedPosts }: SavePostTypes) =>
      configService.addToSaved({ userId, postId, savedPosts }),
  });
};

export const useRemoveFromSaved = () => {
  return useMutation({
    mutationFn: ({ userId, postId, savedPosts }: SavePostTypes) =>
      configService.removeFromSaved({ userId, postId, savedPosts }),
  });
};
