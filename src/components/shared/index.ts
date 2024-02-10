import { lazy } from "react";

import Bottombar from "./Bottombar";
import Topbar from "./Topbar";
import Logo from "./Logo";
import LeftSidebar from "./LeftSidebar";
import Avatar from "./Avatar";
import PostForm from "./form/PostForm";
import FileUploader from "./form/FileUploader";
import PostCard from "./PostCard";
import PostStats from "./PostStats";
import PostComment from "./PostComment";
import ConnectionBtn from "./ConnectionBtn";
import TopCreators from "./TopCreators";
const PostCommentsSection = lazy(() => import("./PostCommentsSection"));
const EditableComment = lazy(() => import("./EditableComment"));
const GridPostsList = lazy(() => import("./GridPostsList"));
const ProfilePhotoUploader = lazy(() => import("./form/ProfilePhotoUploader"));
const UserCard = lazy(() => import("./UserCard"));
const ProfileStats = lazy(() => import("./ProfileStats"));
const ProfileUserCard = lazy(() => import("./ProfileUserCard"));
const RelatedPosts = lazy(() => import("./RelatedPosts"));

export {
  Topbar,
  LeftSidebar,
  Bottombar,
  Logo,
  Avatar,
  PostForm,
  FileUploader,
  PostCard,
  PostStats,
  PostComment,
  PostCommentsSection,
  EditableComment,
  GridPostsList,
  ProfilePhotoUploader,
  ConnectionBtn,
  UserCard,
  TopCreators,
  ProfileStats,
  ProfileUserCard,
  RelatedPosts,
};
