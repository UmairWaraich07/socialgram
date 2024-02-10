import {
  useAddToFollowersList,
  useRemoveFromFollowersList,
} from "@/react-query/queries";
import { Button } from "../ui/button";
import { Models } from "appwrite";
import { toast } from "sonner";
import { ReloadIcon } from "@radix-ui/react-icons";
import React from "react";
import { useUserContext } from "../../contexts/UserContext";

interface ConnectionBtnProps {
  targetUser: Models.Document | undefined;
}

const ConnectionBtn = ({ targetUser }: ConnectionBtnProps) => {
  const { userData, setUserData } = useUserContext();
  const userFollowingList = userData.following;
  const isFollowingUser = targetUser?.followers.includes(userData.id);
  const isUserFollowingYou = targetUser?.following.includes(userData.id);

  const { mutateAsync: addToFollowersList, isPending: isAdding } =
    useAddToFollowersList();
  const { mutateAsync: removeFromFollowersList, isPending: isRemoving } =
    useRemoveFromFollowersList();

  const followTheUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const res = await addToFollowersList({
      userId: userData.id,
      targetUserId: (targetUser as Models.Document)?.$id,
      targetUserFollowersList: targetUser?.followers,
      userFollowingList: userFollowingList!,
    });
    if (!res) {
      toast("Failed to follow this user. Please try again");
    } else {
      setUserData({
        ...userData,
        following: res.following,
      });
      toast(
        `You are now following ${(targetUser as Models.Document).username}`
      );
    }
  };

  const unfollowTheUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const res = await removeFromFollowersList({
      userId: userData.id,
      targetUserId: (targetUser as Models.Document)?.$id,
      targetUserFollowersList: targetUser?.followers,
      userFollowingList: userFollowingList!,
    });
    if (!res) {
      toast("Failed to unfollow this user. Please try again");
    } else {
      setUserData({
        ...userData,
        following: res.following,
      });
      toast(`You have unfollowed  ${targetUser?.username}`);
    }
  };

  if (userData.id === targetUser?.$id) {
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
