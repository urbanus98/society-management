import { useEffect, useState } from "react";
import DynamicTable from "../ui/DynamicTable";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import SubmButton from "../ui/SubmButton";

const LocationsForm = ({
  setMsg,
  setAlertVisibility,
  setAlertColor,
}: {
  setMsg: any;
  setAlertVisibility: any;
  setAlertColor?: any;
}) => {
  const axiosPrivate = useAxiosPrivate();
  const [rows, setRows] = useState<any[]>([{}]);

  useEffect(() => {
    const getLocations = async () => {
      const response = await axiosPrivate.get("data/locations");
      console.log(response.data);
      setRows(response.data);
    };

    getLocations();
  }, []);

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
      header: "Kraj + razdalja od Vipave",
      key: "name",
      placeholder: "Ime lokacije",
      type: "text",
      required: true,
    },
    {
      header: "(km)",
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
      console.log(formData);
      await axiosPrivate.put("data/locations", formData);
      setMsg("Lokacije posodobljene");
      setAlertColor("success");
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
