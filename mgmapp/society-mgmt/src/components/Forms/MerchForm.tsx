import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SubmButton from "../ui/SubmButton";
import ImageUpload from "../ImageUpload";

const MerchForm = ({ item }: { item?: any }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  // const [name, setName] = useState<string>(item?.name || "");
  // const [price, setPrice] = useState<number>(item?.price || 0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      // setName(item?.name);
      // setPrice(item?.price);
      if (item?.image_path) {
        setImagePreview(`http://localhost:8081/${item.image_path}`);
      }
    }
  }, [item]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent form refresh
    try {
      const formData = new FormData();

      // Append form fields
      const name = (event.target as HTMLFormElement).elements.namedItem(
        "name"
      ) as HTMLInputElement;
      const price = (event.target as HTMLFormElement).elements.namedItem(
        "price"
      ) as HTMLInputElement;

      formData.append("name", name.value);
      formData.append("price", price.value);

      // formData.append("name", name);
      // formData.append("price", price.toString());

      // Append the image
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const url = id
        ? `http://localhost:8081/merch/${id}`
        : "http://localhost:8081/merch";

      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit form data");
      }
      navigate(`/merch`);
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  return (
    <form encType="multipart/form-data" onSubmit={handleSubmit}>
      <div className="coluflex">
        <div className="coluflex">
          <label htmlFor="name" className="input_label bright-text">
            Ime
          </label>
          <input
            className="input"
            type="text"
            name="name"
            // value={name}
            // onChange={(e) => setName(e.target.value)} // Update state on input change
            defaultValue={item?.name || ""}
            required
          />
        </div>

        <div className="coluflex">
          <label htmlFor="price" className="input_label bright-text">
            Cena
          </label>
          <input
            className="input"
            type="number"
            name="price"
            // value={price}
            // onChange={(e) => setPrice(Number(e.target.value))} // Update state on input change
            defaultValue={item?.price || ""}
            required
          />
        </div>
        <ImageUpload setImage={setImageFile} preview={imagePreview} />
      </div>
      <SubmButton text="Potrdi" />
    </form>
  );
};

export default MerchForm;
