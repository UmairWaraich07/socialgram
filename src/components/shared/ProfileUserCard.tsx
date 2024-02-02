import { Link } from "react-router-dom";
import { Avatar, ConnectionBtn } from ".";
import { toast } from "sonner";
import { Models } from "appwrite";
import { useState } from "react";
import { useUserContext } from "@/contexts/UserContext";
import { useRemoveFollower } from "@/react-query/queries";
import { Button } from "../ui/button";

interface ProfileUserCardProps {
  user: Models.Document | undefined;
  isFollowersDialog?: boolean;
  isFollowingDialong?: boolean;
  profileOwnerId: string | undefined;
}

const ProfileUserCard = ({
  user,
  isFollowersDialog,
  isFollowingDialong,
  profileOwnerId,
}: ProfileUserCardProps) => {
  const [isUserRemoved, setIsUserRemoved] = useState(false);
  const { userData, setUserData } = useUserContext();
  const { mutateAsync: removeFollower } = useRemoveFollower();

  const handleRemoveFollower = async () => {
    const res = await removeFollower({
      userId: userData.id,
      targetUserId: (user as Models.Document)?.$id,
      userFollowersList: userData.followers,
      targetUserFollowingList: user?.following,
    });
    if (!res) {
      toast(`Failed to remove ${user?.username}. Please try again`);
    } else {
      setUserData({
        ...userData,
        followers: res.followers,
      });
      setIsUserRemoved(true);
      toast(`${user?.username} removed from your followers list`);
    }
  };

  return (
    <div className="w-full flex items-center justify-between">
      <Link to={`/profile/${user?.$id}`} className="flex items-center gap-3">
        <Avatar
          fullname={user?.fullname}
          username={user?.username}
          profilePicture={user?.profilePicture}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h4 className="font-semibold cursor-pointer">{user?.username}</h4>
          <p className="text-light-2/55 cursor-pointer">{user?.fullname}</p>
        </div>
      </Link>
      {isFollowersDialog &&
        (profileOwnerId === userData.id ? (
          <Button
            className="shad-button_dark_4"
            disabled={isUserRemoved}
            onClick={handleRemoveFollower}
          >
            {isUserRemoved ? "Removed" : "Remove"}
          </Button>
        ) : (
          <ConnectionBtn targetUser={user} />
        ))}
      {isFollowingDialong && <ConnectionBtn targetUser={user} />}
    </div>
  );
};

export default ProfileUserCard;
