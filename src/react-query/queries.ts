import {
  CommentPostTypes,
  CreatePostTypes,
  DeleteCommentTypes,
  EditCommentTypes,
  EditPostTypes,
  LikePostTypes,
  SavePostTypes,
  UpdateUserTypes,
  loginUserTypes,
  registerUserTypes,
} from "@/types/index";
import authService from "@/appwrite/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import configService from "@/appwrite/config";
import userService from "@/appwrite/user";

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

// ** POST QUERIES ** //

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

export const useGetPost = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST, postId],
    queryFn: () => configService.getPost(postId),
    enabled: !!postId,
  });
};

export const useEditPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, caption, media, location, tags }: EditPostTypes) =>
      configService.editPost({ postId, caption, media, location, tags }),
    onSuccess: (data, variables) => {
      // queryClient.invalidateQueries({
      //   queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      // });
      queryClient.setQueryData([QUERY_KEYS.GET_POST, variables.postId], data);
    },
  });
};

export const useGetPostLikes = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_LIKES, postId],
    queryFn: () => configService.getLikes(postId),
    enabled: !!postId,
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
    mutationFn: ({ likeRecordId }: { likeRecordId: string; postId: string }) =>
      configService.deleteLike(likeRecordId),
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

// ** POST COMMENT QUERIES ** //

export const useGetPostComments = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_COMMENTS, postId],
    queryFn: () => configService.getPostComments(postId),
    enabled: !!postId,
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ text, postId, userId }: CommentPostTypes) =>
      configService.addComment({ text, postId, userId }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_COMMENTS, variables.postId],
      });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId }: DeleteCommentTypes) =>
      configService.deleteComment(commentId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_COMMENTS, variables.postId],
      });
    },
  });
};

export const useEditComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, text }: EditCommentTypes) =>
      configService.editComment({ commentId, text }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_COMMENTS, variables.postId],
      });
    },
  });
};

// ** USER QUERIES ** //

export const useGetUser = (accountId: string | "") => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS, accountId],
    queryFn: () => userService.getUser(accountId),
    enabled: !!accountId,
  });
};

export const useGetUserLikedPosts = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_LIKED_POSTS],
    queryFn: () => userService.getUserLikedPosts(userId),
    enabled: !!userId,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      fullname,
      username,
      bio,
      profilePicture,
    }: UpdateUserTypes) =>
      userService.updateUserProfile({
        userId,
        fullname,
        username,
        bio,
        profilePicture,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USERS, variables.userId],
      });
    },
  });
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: () => authService.getCurrentUser(),
  });
};
