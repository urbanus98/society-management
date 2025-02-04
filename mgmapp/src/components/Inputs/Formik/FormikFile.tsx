import React from "react";

interface ImageUploadProps {
  name: string;
  label: string;
  formik: any;
}

const InputFile: React.FC<ImageUploadProps> = ({ name, label, formik }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // Update Formik with the file
      formik.setFieldValue(name, file);
    }
  };

  return (
    <div className="coluflex">
      <label htmlFor={name} className="input_label bright-text">
        {label}
      </label>
      <input
        type="file"
        name={name}
        accept="image/*"
        onChange={handleFileChange}
        className="input-file"
      />
      {formik.touched[name] && formik.errors[name] && (
        <div className="error-text">{formik.errors[name]}</div>
      )}
    </div>
  );
};

export default InputFile;
