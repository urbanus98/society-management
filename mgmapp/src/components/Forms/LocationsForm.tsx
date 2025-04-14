import { useEffect, useState } from "react";
import DynamicTable from "../ui/DynamicTable";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import SubmButton from "../ui/SubmButton";

interface Props {
  setMsg: any;
  setAlertVisibility: any;
  setAlertColor?: any;
}

const LocationsForm = ({
  setMsg,
  setAlertVisibility,
  setAlertColor,
}: Props) => {
  const axiosPrivate = useAxiosPrivate();
  const [rows, setRows] = useState<any[]>([{}]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const getLocations = async () => {
      const response = await axiosPrivate.get("/api/data/locations");
      console.log(response.data);
      setRows(response.data);
    };

    getLocations();
  }, [refresh]);

  const columns: {
    header: string;
    key: string;
    placeholder: string;
    values?: any[];
    type: string;
    required?: boolean;
    onChange?: () => void;
  }[] = [
    {
      header: "Kraj",
      key: "name",
      placeholder: "Ime lokacije",
      type: "text",
      required: true,
    },
    {
      header: "Razdalja od Vipave (km)",
      key: "distance",
      placeholder: "km",
      type: "number",
      required: false,
    },
  ];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const formData = { details: rows };
      console.log(formData.details);
      const response = await axiosPrivate.put("/api/data/locations", formData);
      setMsg(response.data.message);
      setAlertColor("success");
      setRefresh((prev) => !prev);
    } catch (error) {
      setMsg("Napaka pri posodabljanju lokacij");
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

export default LocationsForm;
