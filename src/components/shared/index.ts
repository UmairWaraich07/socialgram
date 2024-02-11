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
import ProfileStats from "./ProfileStats";
import RelatedPosts from "./RelatedPosts";
import PostCommentsSection from "./PostCommentsSection";
import GridPostsList from "./GridPostsList";
import EditableComment from "./EditableComment";

const ProfilePhotoUploader = lazy(() => import("./form/ProfilePhotoUploader"));
const UserCard = lazy(() => import("./UserCard"));
const ProfileUserCard = lazy(() => import("./ProfileUserCard"));

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
