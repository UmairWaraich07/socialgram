import storageService from "@/appwrite/storage";
import { Link } from "react-router-dom";
import { Avatar, PostStats } from ".";
import { Loader } from "../Icons";
import { Models } from "appwrite";

interface RelatedPostsProps {
  posts: Models.Document[];
  user: Models.Document;
}

const RelatedPosts = ({ posts, user }: RelatedPostsProps) => {
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
              <div className="flex items-center justify-start gap-2 w-full flex-1">
                <Avatar
                  fullname={user.fullname}
                  username={user.username}
                  profilePicture={user.profilePicture}
                  className="w-8 h-8 rounded-full"
                />
                <p className="line-clamp-1">{user?.fullname}</p>
              </div>
              <PostStats
                postId={post.$id}
                userId={user.$id || ""}
                isExplorePage={true}
              />
            </div>
          </li>
        ))
      )}
    </ul>
  );
};

export default RelatedPosts;
