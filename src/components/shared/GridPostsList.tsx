import storageService from "@/appwrite/storage";
import { Avatar, PostStats } from "@/components/shared";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { Loader } from "../Icons";

interface GridPostListProps {
  posts: Models.Document[];
  user?: Models.Document;
  showUser?: boolean;
  showStats?: boolean;
}
const GridPostsList = ({
  user,
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  return !posts ? (
    <div>
      <Loader />
    </div>
  ) : (
    <ul className="grid-container">
      {posts?.map((post: Models.Document) => (
        <li key={post.$id} className="relative h-80">
          <Link to={`/posts/${post.$id}`} className="grid-post_link">
            <img
              src={String(storageService.getMediaPreview(post.media))}
              alt="post"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <Avatar
                  fullname={user?.fullname}
                  username={user?.username}
                  profilePicture={user?.profilePicture}
                  width={32}
                />
                <p className="line-clamp-1">{user?.fullname}</p>
              </div>
            )}
            {showStats && (
              <PostStats postId={post.$id} userId={user?.$id || ""} />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostsList;
