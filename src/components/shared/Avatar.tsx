import storageService from "@/appwrite/storage";

interface AvatarProps {
  fullname: string;
  username: string;
  profilePicture: string;
  height?: number;
  width?: number;
}

const Avatar = ({
  fullname,
  username,
  profilePicture,
  height = 8,
  width = 8,
}: AvatarProps) => {
  return (
    <div className={`h-${height} w-${width} rounded-full bg-light-3`}>
      {profilePicture ? (
        <img
          src={`${storageService.getMediaPreview(profilePicture)}`}
          alt={username}
        />
      ) : (
        <img
          src={`https://ui-avatars.com/api/?name=${fullname}&background=random&color=ffffff&rounded=true&bold=true`}
          alt={`Avatar for ${username}`}
          className=""
        />
      )}
    </div>
  );
};

export default Avatar;
