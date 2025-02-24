import { useRef } from "react";

const FileUpload = ({ setFile }: { setFile: (file: File | null) => void }) => {
  const fileUploadRef = useRef<any>(null);

  const uploadImageDisplay = () => {
    const uploadedFile = fileUploadRef.current.files[0];
    setFile(uploadedFile);
    console.log("Uploaded file:", uploadedFile);
  };

  return (
    <input
      type="file"
      name="image"
      ref={fileUploadRef}
      onChange={uploadImageDisplay}
    />
  );
};

export default FileUpload;
