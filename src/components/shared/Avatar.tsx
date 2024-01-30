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
  width,
  className,
}: AvatarProps) => {
  return (
    <div className={` ${className} rounded-full`}>
      {profilePicture ? (
        <img
          src={`${storageService.getMediaPreview(profilePicture)}`}
          alt={username}
          className={`object-cover rounded-full`}
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
