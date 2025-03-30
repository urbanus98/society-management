import { useEffect, useState } from "react";
import DynamicTable from "../ui/DynamicTable";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import SubmButton from "../ui/SubmButton";

interface Props {
  setMsg: any;
  setAlertVisibility: any;
  setAlertColor?: any;
}

const MileageRatesForm = ({
  setMsg,
  setAlertVisibility,
  setAlertColor,
}: Props) => {
  const axiosPrivate = useAxiosPrivate();
  const [rows, setRows] = useState<any[]>([{}]);

  useEffect(() => {
    const getMileageRates = async () => {
      const response = await axiosPrivate.get("data/mileage-rates");
      console.log(response.data);
      setRows(response.data);
    };

    getMileageRates();
  }, []);

  const columns: {
    header: string;
    key: string;
    placeholder: string;
    values?: any[];
    type: string;
    step?: string;
    onChange?: () => void;
  }[] = [
    {
      header: "Leto",
      key: "year",
      placeholder: "Leto",
      type: "number",
    },
    {
      header: "Postavka",
      key: "rate",
      placeholder: "€/km",
      type: "number",
      step: "0.01",
    },
  ];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const formData = { details: rows };
      console.log(formData.details);
      const response = await axiosPrivate.put("data/mileage-rates", formData);
      setMsg(response.data.message);
      setAlertColor("success");
    } catch (error) {
      setMsg("Napaka pri posodabljanju postavk");
      setAlertColor("danger");
    }
    setAlertVisibility(true);
  };

  return (
    <form encType="multipart/form-data" onSubmit={handleSubmit}>
      <DynamicTable
        rows={rows}
        setRows={setRows}
        columns={columns}
        isDisabled={true}
      />
      <SubmButton text="Shrani" />
    </form>
  );
};

export default MileageRatesForm;
