import storageService from "@/appwrite/storage";

interface AvatarProps {
  fullname: string;
  username: string;
  profilePicture: string;
  width?: number;
  className?: string;
}

const Avatar = ({
  fullname,
  username,
  profilePicture,
  width = 32,
  className,
}: AvatarProps) => {
  return (
    <div className={`w-[${width}px] ${className} rounded-full`}>
      {profilePicture ? (
        <img
          src={`${storageService.getMediaPreview(profilePicture)}`}
          alt={username}
        />
      ) : (
        <img
          src={`https://ui-avatars.com/api/?name=${fullname}&background=a0a0a0&color=ffffff&rounded=true&bold=true&size=${width}`}
          alt={`Avatar for ${username}`}
          className="w-full"
        />
      )}
    </div>
  );
};

export default Avatar;
