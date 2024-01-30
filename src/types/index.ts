import { Models } from "appwrite";
import React from "react";

export type NavLinkTypes = {
  imgURL: string;
  route: string;
  label: string;
};

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
  fullname: string;
  profilePicture: string;
  email: string;
  bio: string;
  savedPosts: Models.Document[];
};

export type IUserContextTypes = {
  userData: NewUserTypes;
  isAuthenticated: boolean;
  setUserData: React.Dispatch<React.SetStateAction<NewUserTypes>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

export type CreatePostTypes = {
  user: string;
  caption: string;
  media: string;
  location: string;
  tags: string[];
};

export type EditPostTypes = {
  postId: string;
  caption: string;
  media: string;
  location: string;
  tags: string[];
};

export type LikePostTypes = {
  userId: string;
  postId: string;
};

export type SavePostTypes = {
  userId: string;
  postId: string;
  savedPosts: Models.Document[];
};

export type CommentPostTypes = {
  text: string;
  postId: string;
  userId: string;
};

export type EditCommentTypes = {
  commentId: string;
  text: string;
  postId?: string;
};

export type DeleteCommentTypes = {
  commentId: string;
  postId: string;
};

export type UpdateUserTypes = {
  userId: string;
  fullname: string;
  username: string;
  bio: string;
  profilePicture: File[] | string;
};
