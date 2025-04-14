import { useState } from "react";
import Input from "../Inputs/Input";
import { getDate } from "../misc";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useParams } from "react-router-dom";
import SubmButton from "../ui/SubmButton";
import useAuth from "../../hooks/useAuth";

interface Props {
  action: string;
  debt?: any;
}

const DebtForm = ({ debt, action }: Props) => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { id } = useParams();
  const { auth } = useAuth();
  const [amount, setAmount] = useState(debt ? debt.amount : "");
  const [date, setDate] = useState(debt ? debt.date : getDate());
  const [name, setName] = useState(debt ? debt.name : "");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent form refresh
    try {
      const formData = {
        name,
        amount,
        date,
        user_id: auth.id,
        id: id,
      };
      // console.log("auth", auth);
      // console.log("formData", formData);
      if (id) {
        await axiosPrivate.put(`/api/debts/${id}`, formData);
      } else {
        await axiosPrivate.post(`/api/debts/${action}`, formData);
      }
      navigate(`/debts`);
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  return (
    <form encType="multipart/form-data" onSubmit={handleSubmit}>
      <div className="coluflex">
        <Input
          name="name"
          label="Opis"
          value={name}
          handleChange={(event) => setName(event.target.value)}
        />
        <div className="flex gap">
          <div className=" width-100">
            <Input
              name="date"
              type="date"
              label="Datum"
              value={date}
              classes="width-100"
              handleChange={(event) => setDate(event.target.value)}
            />
          </div>
          <Input
            name="amount"
            label="Znesek (€)"
            type="number"
            placeholder="Vsota"
            value={amount}
            handleChange={(event) => setAmount(event.target.value)}
            classes="w70"
          />
        </div>
        <SubmButton text="Potrdi" />
      </div>
    </form>
  );
};

export default DebtForm;
