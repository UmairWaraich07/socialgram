import {
  AddToFollowerListTypes,
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
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
    },
  });
};

export const useGetRecentPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_POSTS],
    queryFn: ({ pageParam }) => configService.getRecentPosts(pageParam),
    initialPageParam: "",
    getNextPageParam: (lastPage, allPages) => {
      const totalDocuments = allPages.reduce(
        (acc, page) => acc + page.documents.length,
        0
      );
      if (totalDocuments === lastPage.total) return null;
      if (lastPage.documents.length === 0) return null;
      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
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

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_POSTS, "infinite"],
    queryFn: ({ pageParam }) => configService.getInfinitePosts(pageParam),
    initialPageParam: "",
    getNextPageParam: (lastPage, allPages) => {
      const totalDocuments = allPages.reduce(
        (acc, page) => acc + page.documents.length,
        0
      );
      if (totalDocuments === lastPage.total) return null;
      if (lastPage.documents.length === 0) return null;
      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
  });
};

export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POSTS, searchTerm],
    queryFn: () => configService.searchPost(searchTerm),
    enabled: !!searchTerm,
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

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => userService.getAllUsers(),
    staleTime: 1 * 60 * 1000,
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

export const useGetUserFollowers = (followers: string[]) => {
  return useQuery({
    queryKey: ["userFollower"],
    queryFn: () => userService.getUserFollowers(followers),
    enabled: !!followers,
  });
};

export const useAddToFollowersList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      targetUserId,
      followersList,
      followingList,
    }: AddToFollowerListTypes) =>
      userService.addToFollowerList({
        userId,
        targetUserId,
        followersList,
        followingList,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USERS],
      });
    },
  });
};
export const useRemoveFromFollowersList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      targetUserId,
      followersList,
      followingList,
    }: AddToFollowerListTypes) =>
      userService.removeFromFollowerList({
        userId,
        targetUserId,
        followersList,
        followingList,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USERS],
      });
    },
  });
};

export const useSearchUsers = (searchTerm: string) => {
  return useQuery({
    queryKey: ["searchUsers"],
    queryFn: () => userService.searchUser(searchTerm),
    enabled: !!searchTerm,
  });
};

export const useGetTopCreators = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS, "top"],
    queryFn: () => userService.getTopCreators(),
    staleTime: 2 * 60 * 1000, // 2 minuts
  });
};
