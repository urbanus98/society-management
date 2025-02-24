import { useRef, useState, useEffect } from "react";
import DefaultImage from "../assets/tt_white.png";

const ImageUpload = ({
  setImage,
  preview,
}: {
  setImage: (file: File | null) => void;
  preview?: string | null;
}) => {
  const [avatarURL, setAvatarURL] = useState<string>(preview || DefaultImage);
  const fileUploadRef = useRef<any>(null);

  useEffect(() => {
    if (preview) {
      setAvatarURL(preview);
    }
  }, [preview]);

  const uploadImageDisplay = () => {
    const uploadedFile = fileUploadRef.current.files[0];
    if (uploadedFile) {
      const cachedURL = URL.createObjectURL(uploadedFile);
      setAvatarURL(cachedURL);
      setImage(uploadedFile); // Pass the file to parent
    }
  };

  return (
    <div className="flex wrap gap margin-tb">
      <img src={avatarURL} alt="avatar" className="w150 border-radius" />
      <input
        type="file"
        name="image"
        ref={fileUploadRef}
        onChange={uploadImageDisplay}
      />
    </div>
  );
};

export default ImageUpload;
