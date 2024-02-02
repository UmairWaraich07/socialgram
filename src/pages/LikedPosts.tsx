import storageService from "@/appwrite/storage";
import { Loader } from "@/components/Icons";
import { Avatar } from "@/components/shared";
import { useUserContext } from "@/contexts/UserContext";
import { useGetUserLikedPosts } from "@/react-query/queries";
import { Models } from "appwrite";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Link, useParams } from "react-router-dom";

const LikedPosts = () => {
  const { ref, inView } = useInView();
  const { id } = useParams();
  const { userData } = useUserContext();
  const {
    data: likedPosts,
    isPending,
    hasNextPage,
    fetchNextPage,
  } = useGetUserLikedPosts(userData.id);
  const allLikedPosts = likedPosts?.pages.flatMap((page) => page.documents);

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView, fetchNextPage]);

  if (userData.id !== id) return;

  return !likedPosts && isPending ? (
    <div>
      <Loader />
    </div>
  ) : (
    <div className="w-full">
      <ul className="grid-container">
        {allLikedPosts?.map((likedPost: Models.Document) => (
          <li key={likedPost.$id} className="relative h-80">
            <Link to={`/post/${likedPost.post.$id}`} className="grid-post_link">
              <img
                src={String(
                  storageService.getMediaPreview(likedPost.post.media)
                )}
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
      {hasNextPage && (
        <div className="w-full flex-center mt-6" ref={ref}>
          <Loader />
        </div>
      )}
    </div>
  );
};

export default LikedPosts;
