import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Input from "../Inputs/Input";
import SubmButton from "../ui/SubmButton";

interface Props {
  setMsg: any;
  setAlertVisibility: any;
  setAlertColor?: any;
}

const SocietyInfoForm = ({
  setMsg,
  setAlertVisibility,
  setAlertColor,
}: Props) => {
  const axiosPrivate = useAxiosPrivate();
  const [bank, setBank] = useState("");
  const [iban, setIban] = useState("");
  const [head, setHead] = useState("");
  const [registry, setRegistry] = useState("");

  useEffect(() => {
    const getSocietyData = async () => {
      const response = await axiosPrivate.get(`/api/data/society/1`);
      const data = response.data;
      console.log(response.data);
      setBank(data.bank);
      setIban(data.iban);
      setHead(data.head);
      setRegistry(data.registry);
    };
    getSocietyData();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const formData = {
        bank,
        iban,
        head,
        registry,
      };
      const response = await axiosPrivate.put(`/api/data/society/1`, formData);
      setMsg(response.data.message);
      setAlertColor("success");
    } catch (error) {
      console.error("Error submitting form data:", error);
      setMsg("Napaka pri pošiljanju podatkov");
      setAlertColor("danger");
    }
    setAlertVisibility(true);
  };
  return (
    <form encType="multipart/form-data" onSubmit={handleSubmit}>
      <div className="coluflex">
        <Input
          name="bank"
          label="Banka"
          value={bank}
          handleChange={(event) => setBank(event.target.value)}
        />
        <Input
          name="iban"
          label="IBAN"
          value={iban}
          handleChange={(event) => setIban(event.target.value)}
        />
        <Input
          name="head"
          label="Predsednik društva"
          value={head}
          handleChange={(event) => setHead(event.target.value)}
        />
        <Input
          name="registry"
          label="Matična številka"
          value={registry}
          handleChange={(event) => setRegistry(event.target.value)}
        />
        <SubmButton />
      </div>
    </form>
  );
};

export default SocietyInfoForm;
