import storageService from "@/appwrite/storage";
import { NewUserTypes } from "@/types";
import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Avatar } from "..";

interface PhotoUploaderProps {
  fieldChange: (files: File[]) => void;
  userData: NewUserTypes;
}
function ProfilePhotoUploader({ fieldChange, userData }: PhotoUploaderProps) {
  const [fileUrl, setFileUrl] = useState(
    userData.profilePicture
      ? String(storageService.getMediaPreview(userData.profilePicture))
      : ""
  );

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    fieldChange(acceptedFiles);
    setFileUrl(URL.createObjectURL(acceptedFiles[0]));
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div className="flex items-center gap-5">
        {fileUrl ? (
          <img
            src={fileUrl}
            className="w-20 h-20 object-cover object-top rounded-full"
          />
        ) : (
          <Avatar
            fullname={userData?.fullname}
            username={userData?.username}
            profilePicture={userData?.profilePicture}
            className="w-[80px] h-[80px] overflow-hidden"
          />
        )}

        <p className="text-primary-500 cursor-pointer">Change profile photo</p>
      </div>
    </div>
  );
}

export default ProfilePhotoUploader;
