import storageService from "@/appwrite/storage";
import { Avatar, PostStats } from "@/components/shared";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { Loader } from "../Icons";

interface GridPostListProps {
  posts: Models.Document[];
  isExplorePage?: boolean;
  showUser?: boolean;
  showStats?: boolean;
}
const GridPostsList = ({
  posts,
  isExplorePage,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
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
              {showUser && (
                <div className="flex items-center justify-start gap-2 w-full flex-1">
                  <Avatar
                    fullname={post?.user.fullname}
                    username={post?.user.username}
                    profilePicture={post?.user.profilePicture}
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="line-clamp-1">{post?.user?.fullname}</p>
                </div>
              )}
              {showStats && (
                <PostStats
                  postId={post.$id}
                  userId={post?.user.$id || ""}
                  isExplorePage={isExplorePage}
                />
              )}
            </div>
          </li>
        ))
      )}
    </ul>
  );
};

export default GridPostsList;
