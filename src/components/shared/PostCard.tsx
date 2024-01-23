import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { Avatar, PostComment, PostStats } from ".";
import { timeAgo } from "@/lib/utils";
import { useUserContext } from "@/contexts/UserContext";
import storageService from "@/appwrite/storage";

interface PostCardProps {
  post: Models.Document;
}
const PostCard = ({ post }: PostCardProps) => {
  const { userData } = useUserContext();
  // console.log({ post });
  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.user.$id}`}>
            <Avatar
              fullname={post.user.fullname}
              username={post.user.username}
              profilePicture={post.user.profilePicture}
              width={48}
            />
          </Link>

          <Link
            to={`/profile/${post.user.$id}`}
            className="flex flex-col cursor-pointer"
          >
            <p className="base-medium lg:body-bold text-light-1 cursor-pointer">
              {post.user.fullname}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular ">
                {timeAgo(post.$createdAt)}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </Link>
        </div>

        {/* ONLY show the edit post to the creator of the post */}
        {userData.id === post.user.$id && (
          <Link to={`/edit-post/${post.$id}`}>
            <img
              src="/assets/icons/edit.svg"
              alt="edit"
              width={20}
              height={20}
            />
          </Link>
        )}
      </div>

      <Link to={`/post/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p className="line-clamp-1">{post.caption}</p>
          <ul className="flex gap-2 mt-2 line-clamp-2">
            {post.tags.map((tag: string, index: number) => (
              <li
                key={`${tag}-${index}`}
                className="text-light-3 small-regular"
              >
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <img
          src={String(storageService.getMediaPreview(post.media))}
          alt="post image"
          className="post-card_img"
        />
      </Link>

      <PostStats postId={post.$id} userId={userData.id} />
      <PostComment postId={post.$id} userId={userData.id} />
    </div>
  );
};

export default PostCard;
