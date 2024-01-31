import {
  useAddToFollowersList,
  useRemoveFromFollowersList,
} from "@/react-query/queries";
import { Button } from "../ui/button";
import { Models } from "appwrite";
import { toast } from "sonner";
import { ReloadIcon } from "@radix-ui/react-icons";
import React from "react";

interface ConnectionBtnProps {
  targetUser: Models.Document;
  userId: string;
}

const ConnectionBtn = ({ targetUser, userId }: ConnectionBtnProps) => {
  const isFollowingUser = targetUser?.followers.includes(userId);
  const isUserFollowingYou = targetUser?.following.includes(userId);
  // console.log({ isFollowingUser });
  // console.log({ isUserFollowingYou });

  const { mutateAsync: addToFollowersList, isPending: isAdding } =
    useAddToFollowersList();
  const { mutateAsync: removeFromFollowersList, isPending: isRemoving } =
    useRemoveFromFollowersList();

  const followTheUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const res = await addToFollowersList({
      userId,
      targetUserId: targetUser?.$id,
      followersList: targetUser?.followers,
      followingList: targetUser?.following,
    });
    if (!res) toast("Failed to follow this user. Please try again");
    toast("You are now following this user");
  };

  const unfollowTheUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Follower List", targetUser?.followers);
    console.log("Following List", targetUser?.following);
    const res = await removeFromFollowersList({
      userId,
      targetUserId: targetUser?.$id,
      followersList: targetUser?.followers,
      followingList: targetUser?.following,
    });
    if (!res) toast("Failed to unfollow this user. Please try again");
    toast("You have unfollowed this user");
  };

  if (userId === targetUser.$id) {
    return (
      <Button type="button" className="shad-button_primary px-8" disabled>
        Follow
      </Button>
    );
  }

  return isFollowingUser ? (
    <Button
      type="button"
      className="shad-button_dark_4 flex-center gap-2"
      onClick={unfollowTheUser}
      disabled={isRemoving}
    >
      {isRemoving ? (
        <div className="min-w-16 w-full flex-center">
          <ReloadIcon className="animate-spin" />
        </div>
      ) : (
        "Following"
      )}
    </Button>
  ) : (
    <Button
      type="button"
      className="shad-button_primary px-8"
      onClick={followTheUser}
      disabled={isAdding}
    >
      {isAdding ? (
        <div className="min-w-16 w-full flex-center">
          <ReloadIcon className="animate-spin" />
        </div>
      ) : isUserFollowingYou ? (
        "Follow Back"
      ) : (
        "Follow"
      )}
    </Button>
  );
};

export default ConnectionBtn;
