import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SubmButton from "../ui/SubmButton";
import ImageUpload from "../ImageUpload";
import FuncButton from "../ui/FuncButton";

interface Row {
  type: string;
  price: string;
}

const MerchForm = ({ item }: { item?: any }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isDisabled, setIsDisabled] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[]>(
    item?.details || [{ type: "", price: "" }]
  );

  useEffect(() => {
    console.log(item);
    if (item) {
      const newRows = item.types.map((type: any) => ({
        type: type.type,
        price: type.price,
      }));

      setRows(newRows);
      setIsDisabled(true);

      if (item?.image_path) {
        setImagePreview(`http://localhost:8081/${item.image_path}`);
      }
    }
  }, [item]);

  const handleRowChange = (index: number, field: keyof Row, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value; // TypeScript knows 'field' is a key of Row
    setRows(updatedRows);
  };

  const handleAddRow = (typeName?: string, typePrice?: any) => {
    setRows([
      ...rows,
      {
        type: typeof typeName === "string" ? typeName : "",
        price: typePrice !== undefined ? typePrice : "",
      },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent form refresh
    try {
      const formData = new FormData();

      // Append form fields
      const name = (event.target as HTMLFormElement).elements.namedItem(
        "name"
      ) as HTMLInputElement;

      formData.append("name", name.value);
      formData.append("details", JSON.stringify(rows)); // Append rows as JSON

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const url = id
        ? `http://localhost:8081/merch/${id}`
        : "http://localhost:8081/merch";

      const method = id ? "PUT" : "POST";

      console.log(formData.get("details"));

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
        <div className="coluflex padding-03">
          <label htmlFor="name" className="input_label bright-text">
            Ime
          </label>
          <input
            className="input"
            type="text"
            name="name"
            defaultValue={item?.name || ""}
            required
          />
        </div>

        <table style={{ borderSpacing: "0px" }}>
          <tbody>
            <tr>
              <th>
                <label className="input_label bright-text">Tip</label>
              </th>
              <th>
                <label className="input_label bright-text">Cena</label>
              </th>
            </tr>

            {rows.map((row, index) => (
              <tr key={index}>
                <td className="width-100">
                  <input
                    className="input width-100"
                    type="text"
                    placeholder="Velikost/barva/model"
                    value={row.type}
                    onChange={(e) =>
                      handleRowChange(index, "type", e.target.value)
                    }
                    required
                  />
                </td>
                <td className="w70">
                  <input
                    className="input w70"
                    type="number"
                    placeholder="Cena"
                    value={row.price}
                    onChange={(e) =>
                      handleRowChange(index, "price", e.target.value)
                    }
                    required
                  />
                </td>
                <td>
                  {index > 0 ? (
                    <FuncButton
                      color="danger"
                      isDisabled={isDisabled}
                      onClick={() => handleRemoveRow(index)}
                    >
                      <img src="/images/minus_s.png" alt="remove" width={20} />
                    </FuncButton>
                  ) : (
                    <FuncButton onClick={handleAddRow} color="secondary">
                      <img
                        src="/images/plus_s.png"
                        alt="add"
                        width={20}
                        height={20}
                      />
                    </FuncButton>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ImageUpload setImage={setImageFile} preview={imagePreview} />
      </div>
      <SubmButton text="Potrdi" />
    </form>
  );
};

export default MerchForm;
