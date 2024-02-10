import { lazy } from "react";

const Home = lazy(() => import("./Home"));
const Post = lazy(() => import("./PostDetails"));
const Profile = lazy(() => import("./Profile"));
const Saved = lazy(() => import("./Saved"));
const AllUsers = lazy(() => import("./AllUsers"));
const CreatePost = lazy(() => import("./CreatePost"));
const EditPost = lazy(() => import("./EditPost"));
const Explore = lazy(() => import("./Explore"));
const EditProfile = lazy(() => import("./EditProfile"));
const ProfilePosts = lazy(() => import("./ProfilePosts"));
const LikedPosts = lazy(() => import("./LikedPosts"));

export {
  Home,
  Post,
  Profile,
  Saved,
  AllUsers,
  CreatePost,
  EditPost,
  Explore,
  EditProfile,
  LikedPosts,
  ProfilePosts,
};
