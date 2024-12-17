import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../Inputs/Input";
import DynamicTable from "../ui/DynamicTable";
import SubmButton from "../ui/SubmButton";
import { getDate } from "../misc";

const SalesForm = ({ sale }: { sale?: any }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDisabled, setIsDisabled] = useState(false);
  const [stuffTypes, setStuffTypes] = useState<any[]>([]);
  const [rows, setRows] = useState<any[]>([{}]);
  const [date, setDate] = useState(sale ? sale.date : getDate());

  useEffect(() => {
    axios
      .get(`http://localhost:8081/stuff-types`)
      .then((response) => {
        setStuffTypes(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    if (sale) {
      setDate(sale.date);
      const newRows = sale.types.map((type: any) => ({
        id: type.id,
        price: type.price,
        amount: type.amount,
        stuffType_id: type.stufftype_id, // column key
      }));
      setRows(newRows);
      setIsDisabled(true);
    }
  }, [sale]);

  const columns: {
    header: string;
    key: string;
    placeholder: string;
    values?: any[];
    type: string;
  }[] = [
    {
      header: "Izdelek",
      key: "stuffType_id",
      placeholder: "Izdelek",
      values: stuffTypes,
      type: "select",
    },
    {
      header: "Cena (€)",
      key: "price",
      placeholder: "Cena",
      type: "number",
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
    event.preventDefault();

    const data = {
      date,
      sold: rows,
    };

    console.log(data);

    if (sale) {
      await axios.put(`http://localhost:8081/sales/${id}`, data);
    } else {
      await axios.post(`http://localhost:8081/sales`, data);
    }

    navigate("/merch/sales");
  };

  return (
    <form encType="multipart/form-data" onSubmit={handleSubmit}>
      <div className="coluflex">
        <div className=" width-100 padding-03">
          <Input
            name="date"
            type="date"
            label="Datum naročila"
            value={date}
            classes="width-100"
            handleChange={handleDateChange}
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

export default SalesForm;
