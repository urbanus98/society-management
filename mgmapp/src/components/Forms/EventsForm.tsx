import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SubmButton from "../ui/SubmButton";
import { getDate } from "../misc";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Input from "../Inputs/Input";
import InputSelect from "../Inputs/InputSelect";

interface Props {
  event?: any;
}

const EventsForm = ({ event }: Props) => {
  const axiosPrivate = useAxiosPrivate();
  const { id } = useParams();
  const [evenTypes, setEvenTypes] = useState<any[]>([]);
  const [disabledSubmit, setDisabledSubmit] = useState(true);

  const [date, setDate] = useState(event?.date ?? getDate());
  const [typeId, setTypeId] = useState(event?.type_id ?? 1);
  const [name, setName] = useState(event?.name ?? "");
  const [duration, setDuration] = useState(event?.duration ?? 0);

  useEffect(() => {
    const fetchEventTypes = axiosPrivate.get("/api/events/types");

    fetchEventTypes
      .then((typesResponse) => {
        setEvenTypes(typesResponse.data);
        setDisabledSubmit(true);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [axiosPrivate]);

  useEffect(() => {
    setDisabledSubmit(false);
  }, [date, typeId, name, duration]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const data = {
        name,
        duration,
        date,
        typeId,
      };
      if (id) {
        await axiosPrivate.put(`/api/events/${id}`, data);
      } else {
        await axiosPrivate.post("/api/events", data);
      }
      // navigate("/events");
      setDisabledSubmit(true);
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap">
        <div className="width-100">
          <Input
            label="Ime"
            name="name"
            value={name}
            placeholder="Prepoznaven naslov..."
            handleChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Input
            label="Trajanje (h)"
            name="duration"
            value={duration}
            type="number"
            classes="w80"
            handleChange={(e) => setDuration(parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="flex gap">
        <div className="width-50">
          <InputSelect
            label="Tip dogodka"
            name="typeId"
            defaultvalue={typeId}
            values={evenTypes}
            withDisabled={false}
            classes="width-100"
            onChange={(e) => setTypeId(e.target.value)}
          />
        </div>
        <div className="width-50">
          <Input
            label="Datum dogodka"
            name="date"
            type="date"
            value={date}
            handleChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <SubmButton disabled={disabledSubmit} />
    </form>
  );
};

export default EventsForm;
