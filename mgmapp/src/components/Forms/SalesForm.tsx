import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDate } from "../misc";
import Input from "../Inputs/Input";
import DynamicTable from "../ui/DynamicTable";
import SubmButton from "../ui/SubmButton";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const SalesForm = ({ sale }: { sale?: any }) => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDisabled, setIsDisabled] = useState(false);
  const [stuffTypes, setStuffTypes] = useState<any[]>([]);
  const [rows, setRows] = useState<any[]>([{}]);
  const [date, setDate] = useState(sale ? sale.date : getDate());
  const [note, setNote] = useState(sale?.note);

  useEffect(() => {
    axiosPrivate
      .get(`/merch/types/true`)
      .then((response) => {
        if (sale) {
          const newRows = sale.types.map((type: any) => ({
            id: type.id,
            price: type.price,
            quantity: type.quantity,
            stuffType_id: type.stufftype_id,
          }));
          setRows(newRows);
          setIsDisabled(true);
        } else {
          if (response.data.length > 0) {
            setRows([
              {
                stuffType_id: response.data[0].id.toString(),
                price: response.data[0].price,
                quantity: 0,
              },
            ]);
          } else {
            setRows([{ stuffType_id: "", price: 0, quantity: 0 }]);
            console.warn("No stuff types available");
          }
        }
        setStuffTypes(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [sale]);

  const columns: {
    header: string;
    key: string;
    placeholder: string;
    values?: any[];
    type: string;
    classes?: string;
    required?: boolean;
    disabledOption?: boolean;
    onChange?: (rowIndex: number, selectedValue: string) => void;
  }[] = [
    {
      header: "Izdelek",
      key: "stuffType_id",
      placeholder: "Izdelek",
      values: stuffTypes,
      type: "select",
      required: true,
      disabledOption: false,
      onChange: (rowIndex: number, selectedValue: string) => {
        changePrice(rowIndex, selectedValue);
      },
    },
    {
      header: "Cena (€)",
      key: "price",
      placeholder: "Cena",
      type: "number",
      required: true,
      classes: "w100 mw100",
    },
    {
      header: "Kolicina",
      key: "quantity",
      placeholder: "Kolicina",
      type: "number",
      required: true,
      classes: "w100 mw100",
    },
  ];

  const changePrice = (rowIndex: number, selectedValue: string) => {
    // Find the selected stuff type
    const selectedStuff = stuffTypes.find(
      (stuff) => stuff.id.toString() === selectedValue
    );
    if (selectedStuff && selectedStuff.price) {
      // Update the price for this row
      setRows((prevRows) => {
        const newRows = [...prevRows];
        newRows[rowIndex] = {
          ...newRows[rowIndex],
          price: selectedStuff.price,
        };
        return newRows;
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const data = {
      date,
      note,
      sold: rows,
    };

    if (sale) {
      await axiosPrivate.put(`/sales/${id}`, data);
    } else {
      await axiosPrivate.post(`/sales`, data);
    }
    navigate("/merch/sales");
  };

  return (
    <form encType="multipart/form-data" onSubmit={handleSubmit}>
      <div className="coluflex">
        <div className="flex gap-sc width-100 padding-03">
          <Input
            name="date"
            type="date"
            label="Datum naročila"
            value={date}
            handleChange={(e) => setDate(e.target.value)}
          />
          <div className="width-100">
            <Input
              name="note"
              label="Opombe"
              value={note}
              placeholder="Obrazložitev; komu, kako, zakaj..."
              classes="width-100"
              handleChange={(e) => setNote(e.target.value)}
            />
          </div>
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
