import React, { useEffect, useState } from "react";
import DynamicTable from "../ui/DynamicTable";
import SubmButton from "../ui/SubmButton";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../Inputs/Input";
import { getDate } from "../misc";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import FileUpload from "../FileUpload";

const API_URL = import.meta.env.VITE_API_URL;

const OrdersForm = ({ order }: { order?: any }) => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDisabled, setIsDisabled] = useState(false);
  const [stuffTypes, setStuffTypes] = useState<any[]>([]);
  const [rows, setRows] = useState<any[]>([{}]);
  const [price, setPrice] = useState(order ? order.price : 0);
  const [date, setDate] = useState(order ? order.date : getDate());
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  // const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    axiosPrivate
      .get(`merch/types/false`)
      .then((response) => {
        setStuffTypes(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    if (order) {
      const newRows = order.types.map((type: any) => ({
        id: type.id,
        name: type.name,
        quantity: type.quantity,
        stuffType_id: type.stufftype_id, // column key
      }));
      setRows(newRows);
      setIsDisabled(true);

      if (order?.filePath) {
        setFilePreview(`${API_URL}/${order.filePath}`);
      }
    }
  }, [order]);

  const columns: {
    header: string;
    key: string;
    placeholder: string;
    values?: any[];
    type: string;
    classes?: string;
    required?: boolean;
    onChange?: () => void;
  }[] = [
    {
      header: "Izdelek",
      key: "stuffType_id",
      placeholder: "Izdelek",
      values: stuffTypes,
      type: "select",
      required: true,
    },
    {
      header: "Kolicina",
      key: "quantity",
      placeholder: "Kolicina",
      type: "number",
      required: true,
      classes: "w100",
    },
  ];

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent form refresh
    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      formData.append("date", date);
      formData.append("price", price);
      formData.append("details", JSON.stringify(rows));

      if (id) {
        await axiosPrivate.put(`orders/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axiosPrivate.post("orders", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      navigate(`/merch/orders`);
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  return (
    <form encType="multipart/form-data" onSubmit={handleSubmit}>
      <div className="coluflex">
        <div className="flex gap-sc padding-03">
          <div className="width-100">
            <Input
              name="date"
              type="date"
              label="Datum naročila"
              value={date}
              classes="width-100"
              handleChange={handleDateChange}
            />
          </div>
          <Input
            name="price"
            label="Cena (€)"
            type="number"
            placeholder="Vsota"
            value={price}
            classes="w70"
            step="0.01"
            handleChange={(event) => setPrice(Number(event.target.value))}
          />
        </div>
        <DynamicTable
          rows={rows}
          setRows={setRows}
          columns={columns}
          isDisabled={isDisabled}
        />
        <div className="coluflex">
          <div className="flex">
            <label className="input_label bright-text">
              Pripni račun: &nbsp;
              {order?.filePath && (
                <a href={filePreview} target="_blank" rel="noopener noreferrer">
                  {order.filePath.split("/").pop()}
                </a>
              )}
            </label>
          </div>
          <div className="input_label">
            <FileUpload setFile={setFile} />
          </div>
          <SubmButton text="Potrdi" />
        </div>
      </div>
    </form>
  );
};

export default OrdersForm;
