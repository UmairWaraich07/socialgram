import { GridPostsList } from "@/components/shared";
import { Models } from "appwrite";
import { useOutletContext } from "react-router-dom";
const ProfilePosts = () => {
  const [user, posts]: [user: Models.Document, posts: Models.Document[]] =
    useOutletContext();
  return <GridPostsList posts={posts} user={user} showUser={false} />;
};

export default ProfilePosts;
