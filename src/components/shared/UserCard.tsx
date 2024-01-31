import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { Avatar, ConnectionBtn } from ".";
import { useUserContext } from "@/contexts/UserContext";

interface UserCardProps {
  user: Models.Document;
}

const UserCard = ({ user }: UserCardProps) => {
  const { userData } = useUserContext();
  return (
    <Link to={`/profile/${user.$id}`} className="user-card">
      <Avatar
        fullname={user.fullname}
        username={user.username}
        profilePicture={user.profilePicture}
        className="w-14 h-14 overflow-hidden"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.fullname}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>

      <ConnectionBtn targetUser={user} userId={userData.id} />
    </Link>
  );
};

export default UserCard;
