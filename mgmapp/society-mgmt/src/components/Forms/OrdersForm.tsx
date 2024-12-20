import React, { useEffect, useState } from "react";
import DynamicTable from "../ui/DynamicTable";
import SubmButton from "../ui/SubmButton";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../Inputs/Input";
import { getDate } from "../misc";
import axios from "axios";

const OrdersForm = ({ order }: { order?: any }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDisabled, setIsDisabled] = useState(false);
  const [stuffTypes, setStuffTypes] = useState<any[]>([]);
  const [rows, setRows] = useState<any[]>([{}]);
  const [date, setDate] = useState(order ? order.date : getDate());

  useEffect(() => {
    axios
      .get(`http://localhost:8081/stuff-types`)
      .then((response) => {
        setStuffTypes(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    if (order) {
      setDate(order.date);
      const newRows = order.types.map((type: any) => ({
        id: type.id,
        name: type.name,
        amount: type.amount,
        stuffType_id: type.stufftype_id, // column key
      }));
      setRows(newRows);
      setIsDisabled(true);
    }
  }, [order]);

  const columns: {
    header: string;
    key: string;
    placeholder: string;
    values?: any[];
    type: string;
    onChange?: () => void;
  }[] = [
    // {
    //   header: "Izdelek",
    //   key: "stuff",
    //   placeholder: "Izdelek",
    //   values: stuff,
    //   type: "select",
    //   onChange: () => {
    //     console.log("stuff changed");
    //   },
    // },
    {
      header: "Izdelek",
      key: "stuffType_id",
      placeholder: "Izdelek",
      values: stuffTypes,
      type: "select",
    },
    {
      header: "Kolicina",
      key: "amount",
      placeholder: "Kolicina",
      type: "number",
    },
  ];

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent form refresh
    try {
      const price = (event.target as HTMLFormElement).elements.namedItem(
        "price"
      ) as HTMLInputElement;

      const formData = {
        details: rows,
        date,
        price: price.value,
      };

      console.log(formData);

      const url = id
        ? `http://localhost:8081/orders/${id}`
        : "http://localhost:8081/orders/";

      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json", // Ensure the correct content type
        },
        body: JSON.stringify(formData), // Serialize the data as JSON
      });

      if (!response.ok) {
        throw new Error("Failed to submit form data");
      }
      navigate(`/merch/orders`);
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  return (
    <form encType="multipart/form-data" onSubmit={handleSubmit}>
      <div className="coluflex">
        <div className="flex gap padding-03">
          <div className=" width-100">
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
            label="Cena"
            type="number"
            placeholder="Vsota"
            value={order ? order.price : ""}
            classes="w70"
          />
        </div>
        <DynamicTable
          rows={rows}
          setRows={setRows}
          columns={columns}
          isDisabled={isDisabled}
        />
        <SubmButton text="Potrdi" />
      </div>
    </form>
  );
};

export default OrdersForm;
