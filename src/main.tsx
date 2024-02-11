import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import SignInForm from "./_auth/forms/SignInForm";
import SignUpForm from "./_auth/forms/SignUpForm";
import AuthLayout from "./_auth/AuthLayout";
import {
  AllUsers,
  CreatePost,
  EditPost,
  EditProfile,
  Error,
  Explore,
  Home,
  LikedPosts,
  NotFound,
  Post,
  Profile,
  ProfilePosts,
  Saved,
} from "./pages";
import React from "react";
import RootLayout from "./RootLayout";
import "./globals.css";
import { QueryProvider } from "./react-query/QueryProvider";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<Error />}>
      <Route element={<AuthLayout />}>
        <Route path="sign-in" element={<SignInForm />} />
        <Route path="sign-up" element={<SignUpForm />} />
      </Route>

      {/* Private Routes */}
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="all-users" element={<AllUsers />} />
        <Route path="saved" element={<Saved />} />
        <Route path="create-post" element={<CreatePost />} />
        <Route path="edit-post/:id" element={<EditPost />} />
        <Route path="profile/:id" element={<Profile />}>
          <Route index element={<ProfilePosts />} />
          <Route path="liked-posts" element={<LikedPosts />} />
        </Route>
        <Route path="edit-profile/:id" element={<EditProfile />} />
        <Route path="post/:id" element={<Post />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  </React.StrictMode>
);
