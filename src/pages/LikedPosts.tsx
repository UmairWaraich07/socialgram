import storageService from "@/appwrite/storage";
import { Loader } from "@/components/Icons";
import { Avatar } from "@/components/shared";
import { useUserContext } from "@/contexts/UserContext";
import { useGetUserLikedPosts } from "@/react-query/queries";
import { Models } from "appwrite";
import { Link, useParams } from "react-router-dom";

const LikedPosts = () => {
  const { id } = useParams();
  const { userData } = useUserContext();
  const { data: likedPosts, isPending } = useGetUserLikedPosts(userData.id);

  if (userData.id !== id) return;

  return !likedPosts && isPending ? (
    <div>
      <Loader />
    </div>
  ) : (
    <ul className="grid-container">
      {likedPosts?.map((likedPost: Models.Document) => (
        <li key={likedPost.$id} className="relative h-80">
          <Link to={`/post/${likedPost.post.$id}`} className="grid-post_link">
            <img
              src={String(storageService.getMediaPreview(likedPost.post.media))}
              alt="post"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="grid-post_user">
            <div className="flex items-center justify-start gap-2 flex-1">
              <Avatar
                fullname={likedPost.post.user.fullname}
                username={likedPost.post.user?.username}
                profilePicture={likedPost.post.user?.profilePicture}
                className="w-8 h-8 overflow-hidden"
              />
              <p className="line-clamp-1">{likedPost.post.user?.fullname}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default LikedPosts;
