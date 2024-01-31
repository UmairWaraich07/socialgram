import storageService from "@/appwrite/storage";
import { Loader } from "@/components/Icons";
import { PostStats } from "@/components/shared";
import { Models } from "appwrite";
import { Link, useOutletContext } from "react-router-dom";
const ProfilePosts = () => {
  const [user, posts]: [user: Models.Document, posts: Models.Document[]] =
    useOutletContext();
  return !posts ? (
    <div className="w-full flex-center">
      <Loader />
    </div>
  ) : (
    <ul className="grid-container">
      {posts.length === 0 ? (
        <p className="text-light-4">No posts to show</p>
      ) : (
        posts?.map((post: Models.Document) => (
          <li key={post.$id} className="relative h-80">
            <Link to={`/post/${post.$id}`} className="grid-post_link">
              <img
                src={String(storageService.getMediaPreview(post.media))}
                alt="post"
                className="h-full w-full object-cover"
              />
            </Link>

            <div className="grid-post_user">
              <PostStats postId={post.$id} userId={user.$id || ""} />
            </div>
          </li>
        ))
      )}
    </ul>
  );
};

export default ProfilePosts;
