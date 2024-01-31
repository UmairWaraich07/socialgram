import storageService from "@/appwrite/storage";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

interface FileUploaderProps {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
}

export default function FileUploader({
  fieldChange,
  mediaUrl,
}: FileUploaderProps) {
  const [fileUrl, setFileUrl] = useState(
    mediaUrl ? String(storageService?.getMediaPreview(mediaUrl)) : ""
  );

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      // Do something with the files
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [fieldChange]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img src={fileUrl} alt="image" className="file_uploader-img" />
          </div>
          <p className="file_uploader-label">Click or drag photo to replace</p>
        </>
      ) : (
        <div className="file_uploader-box">
          <img
            src="/public/assets/icons/file-upload.svg"
            width={97}
            height={77}
            alt="file-upload"
          />

          <h3 className="base-medium text-light-2 mb-2 mt-6">
            Drag photo here
          </h3>
          <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>
          <Button type="button" className="shad-button_dark_4">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
}
