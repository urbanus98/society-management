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
  const [discount, setDiscount] = useState(sale?.discount ?? 0);
  const [sum, setSum] = useState(0);

  useEffect(() => {
    axiosPrivate
      .get(`/api/merch/types/true`)
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
      header: "Količina",
      key: "quantity",
      placeholder: "Količina",
      type: "number",
      required: true,
      classes: "w100 mw100",
    },
  ];

  useEffect(() => {
    calculateSum();
  }, [rows, discount]);

  const calculateSum = () => {
    console.log(rows);
    const total = rows.reduce((acc, row) => {
      const price = parseFloat(row.price) || 0;
      const quantity = parseFloat(row.quantity) || 0;
      return acc + price * quantity;
    }, 0);

    // console.log("Total = ", total.toFixed(2));
    setSum(total - discount);
  }

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
      discount,
      sold: rows,
    };

    if (sale) {
      await axiosPrivate.put(`/api/sales/${id}`, data);
    } else {
      await axiosPrivate.post(`/api/sales`, data);
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
        <table className="width-100">
          <tbody>
            <tr>
              <td className="width-100"></td>
              <td className="w100 mw100 input_label bright-text" style={{ textAlign: "right" }}>Popust (&euro;):</td>
              <td className="w100 mw100">
                <input
                  name="discount"
                  type="number"
                  value={discount}
                  className="input w60"
                  onChange={(e) => setDiscount(e.target.value)}
                  />
              </td>
              <td style={{ minWidth: '100px' }}>
                <h5 className="input_label bright-text">
                  &sum; { sum } &euro;
                </h5>
              </td>
            </tr>
          </tbody>
        </table>
        <SubmButton text="Potrdi" />
      </div>
    </form>
  );
};

export default SalesForm;
