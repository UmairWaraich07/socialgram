import { useUserContext } from "../../contexts/UserContext";
import {
  useAddLike,
  useAddToSaved,
  useDeleteLike,
  useGetPostLikes,
  useRemoveFromSaved,
} from "@/react-query/queries";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface PostStatsProps {
  postId: string;
  userId: string;
  totalComments?: number;
  isExplorePage?: boolean;
}

const PostStats = ({
  postId,
  userId,
  totalComments,
  isExplorePage = false,
}: PostStatsProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const { userData, setUserData } = useUserContext();
  const { data: likes } = useGetPostLikes(postId);
  const [isLiked, setIsLiked] = useState(false);
  const { mutateAsync: addLike } = useAddLike();
  const { mutateAsync: deleteLike } = useDeleteLike();
  const { mutateAsync: addToSaved } = useAddToSaved();
  const { mutateAsync: removeFromSaved } = useRemoveFromSaved();

  useEffect(() => {
    // loop through the collection of likes of that post and check if this user liked it or not
    likes?.documents.map((doc) => doc.user.$id === userId && setIsLiked(true));

    userData &&
      userData?.savedPosts?.map(
        (post) => post.$id === postId && setIsSaved(true)
      );
  }, [postId, userData, likes, userId]);

  const handleLike = async () => {
    if (isLiked) {
      // remove the like
      const foundRecord = likes?.documents.find(
        (doc) => doc.user.$id === userId
      );
      const likeRecordId = foundRecord ? foundRecord.$id : "";
      // delete the document with this user and post Id
      setIsLiked(false);
      const res = deleteLike({ likeRecordId, postId });
      if (!res) {
        setIsLiked(true);
        toast("Unliked action failed.");
      } else {
        setIsLiked(false);
        toast("Post unliked successfully.");
      }
    } else {
      // add the doucment with this user and postId
      setIsLiked(true);
      const res = await addLike({ postId, userId });
      if (!res) {
        setIsLiked(false);
        toast("Liked action failed.");
      } else {
        setIsLiked(true);
        toast("Post liked successfully.");
      }
    }
  };

  const handleSaved = async () => {
    const savedPosts = userData.savedPosts;
    if (isSaved) {
      // remove the post from the savedPosts of the user
      setIsSaved(false);
      const res = await removeFromSaved({
        userId,
        postId,
        savedPosts: savedPosts ? savedPosts : [],
      });
      if (res) {
        setIsSaved(false);
        toast("Post removed from saved collection");
        setUserData({
          ...userData,
          savedPosts: res,
        });
      } else {
        setIsSaved(true);
        toast("Action failed!");
      }
    } else {
      // add the post to the savedPosts of the user
      setIsSaved(true);
      const res = await addToSaved({
        userId,
        postId,
        savedPosts: savedPosts ? savedPosts : [],
      });
      if (res) {
        setIsSaved(true);
        toast("Post added to saved collection");
        setUserData({
          ...userData,
          savedPosts: res,
        });
      } else {
        setIsSaved(false);
        toast("Action failed!");
      }
    }
  };

  return (
    <div
      className={`${
        !isExplorePage && "w-full"
      } flex justify-between  gap-2 items-center z-20 `}
    >
      <div className="flex items-center w-full gap-4">
        <div className="flex gap-2">
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
          <p className="small-medium lg:base-medium">{likes?.total}</p>
        </div>
        <Link to={`/post/${postId}`} className="flex items-center gap-2">
          <img
            src="/assets/icons/comment.svg"
            alt="comments"
            width={20}
            height={20}
          />
          {totalComments && (
            <p className="small-medium lg:base-medium">{totalComments}</p>
          )}
        </Link>
      </div>

      {!isExplorePage && (
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
      )}
    </div>
  );
};

export default PostStats;
