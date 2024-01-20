import { useUserContext } from "@/contexts/UserContext";
import {
  useAddLike,
  useAddToSaved,
  useCheckLiked,
  useDeleteLike,
  useGetPostLikes,
  useRemoveFromSaved,
} from "@/react-query/queries";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PostStatsProps {
  postId: string;
  userId: string;
}

const PostStats = ({ postId, userId }: PostStatsProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const { userData, setUserData } = useUserContext();
  const { data: likes } = useGetPostLikes(postId);
  const { data: isLikedPost } = useCheckLiked({ postId, userId });
  const [isLiked, setIsLiked] = useState(false);
  const { mutateAsync: addLike } = useAddLike();
  const { mutateAsync: deleteLike } = useDeleteLike();
  const { mutateAsync: addToSaved } = useAddToSaved();
  const { mutateAsync: removeFromSaved } = useRemoveFromSaved();

  useEffect(() => {
    if (isLikedPost) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
    userData.savedPosts.map((post) => post.$id === postId && setIsSaved(true));
  }, [postId, userData.savedPosts, isLikedPost]);

  const handleLike = async () => {
    if (isLiked) {
      // remove the like
      // delete the document with this user and post Id
      const res = deleteLike({ postId, userId });
      if (!res) {
        toast("Unliked action failed.");
      } else {
        setIsLiked(false);
        toast("Unliked successfully.");
      }
    } else {
      // add the doucment with this user and postId
      const res = addLike({ postId, userId });
      if (!res) {
        toast("Liked action failed.");
      } else {
        setIsLiked(true);
        toast("Liked successfully.");
      }
    }
  };

  const handleSaved = async () => {
    const savedPosts = userData.savedPosts;
    if (isSaved) {
      // remove the post from the savedPosts of the user
      const res = await removeFromSaved({
        userId,
        postId,
        savedPosts,
      });
      if (res) {
        setIsSaved(false);
        toast("Post removed from saved collection");
        setUserData({
          ...userData,
          savedPosts: res,
        });
      } else {
        toast("Action failed!");
      }
    } else {
      // add the post to the savedPosts of the user
      const res = await addToSaved({
        userId,
        postId,
        savedPosts,
      });
      if (res) {
        setIsSaved(true);
        toast("Post added to saved collection");
        setUserData({
          ...userData,
          savedPosts: res,
        });
      } else {
        toast("Action failed!");
      }
    }
  };

  return (
    <div className={`flex justify-between items-center z-20 `}>
      <div className="flex gap-2 mr-5">
        <img
          src={`${
            isLiked ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={handleLike}
        />
        <p className="small-medium lg:base-medium">{likes}</p>
      </div>

      <div className="flex gap-2">
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="share"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={handleSaved}
        />
      </div>
    </div>
  );
};

export default PostStats;
