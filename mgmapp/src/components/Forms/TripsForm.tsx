import { useEffect, useState } from "react";
import DynamicTable from "../ui/DynamicTable";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import SubmButton from "../ui/SubmButton";
import useAuth from "../../hooks/useAuth";

const TripsForm = ({
  eventId,
  setMsg,
  setAlertVisibility,
  setAlertColor,
}: {
  eventId: any;
  setMsg?: any;
  setAlertVisibility?: any;
  setAlertColor?: any;
}) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [removedTripIds, setRemovedTripIds] = useState<any[]>([]); // Persist across renders

  const [fistInsert, setFirstInsert] = useState<boolean>(true);
  const [locations, setLocations] = useState<any[]>([{}]);
  const [rows, setRows] = useState<any[]>([
    { origin: 1, destination: "", mileage: "", return: true },
  ]);

  useEffect(() => {
    const getLocations = async () => {
      const response = await axiosPrivate.get("data/locations");
      //   console.log(response.data);
      setLocations(response.data);
    };
    const getTrips = async () => {
      const response = await axiosPrivate.get(`trips/${eventId}`);
      console.log(response?.data);
      const newRows = formatRows(response.data);
      if (newRows.length > 0) {
        setFirstInsert(false);
        setRows(newRows);
      }
    };

    getLocations();
    getTrips();
  }, []);

  const formatRows = (rows: any) => {
    const newRows: any[] = [];
    const seen = new Set();

    rows.forEach((trip: any, index: number) => {
      if (seen.has(index)) return; // Skip rows that were already paired

      const nextTrip = rows[index + 1];

      if (isThisUsers(trip)) {
        if (
          nextTrip &&
          trip.origin_id === nextTrip.destination_id &&
          trip.destination_id === nextTrip.origin_id
        ) {
          // Mark the first occurrence as a return trip
          newRows.push({
            id: trip.id,
            origin: trip.origin_id,
            destination: trip.destination_id,
            mileage: trip.mileage,
            return: true,
          });

          // Mark the second row as processed
          seen.add(index + 1);
          //   removedTripIds.push(nextTrip.id);
          setRemovedTripIds((prev) => [...prev, nextTrip.id]); // Correctly updates state
          console.log(removedTripIds);
        } else {
          // Push as normal if there's no return pair
          newRows.push({
            id: trip.id,
            origin: trip.origin_id,
            destination: trip.destination_id,
            mileage: trip.mileage,
            return: false,
          });
        }
      }
    });

    console.log(newRows);
    return newRows;
  };

  const isThisUsers = (row: any) => {
    return row.user_id == auth.id;
  };

  const columns: {
    header: string;
    key: string;
    placeholder?: string;
    values?: any[];
    type: string;
    classes?: string;
    onChange?: () => void;
  }[] = [
    {
      header: "Povratna",
      key: "return",
      type: "checkbox",
      classes: "bigcheck",
    },
    {
      header: "Izvor",
      key: "origin",
      placeholder: "Začetna lokacija",
      type: "select",
      values: locations,
      classes: "w150",
    },
    {
      header: "Cilj",
      key: "destination",
      placeholder: "Končna lokacija",
      type: "select",
      values: locations,
      classes: "w150",
    },
    {
      header: "Kilometraža",
      key: "mileage",
      placeholder: "Razdalja",
      type: "number",
    },
  ];

  const handleReturn = () => {
    let counter = 0;
    return rows.flatMap((row: any) => {
      if (row.return) {
        return [
          row,
          {
            ...row,
            id: removedTripIds[counter++],
            origin: row.destination,
            destination: row.origin,
          },
        ];
      } else {
        return [row];
      }
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    var response: any = {};
    try {
      const formData = {
        details: handleReturn(),
        userId: auth.id,
        eventId: eventId,
      };
      console.log(formData);
      if (fistInsert) {
        response = await axiosPrivate.post("trips", formData);
      } else {
        response = await axiosPrivate.put(`trips/${eventId}`, formData);
      }
      setAlertColor("success");
      setMsg(response.data.message);
    } catch (error) {
      console.log(error);
      setAlertColor("danger");
      setMsg(response.data.error ?? "Napaka pri posodabljanju poti");
    }
    setAlertVisibility(true);
  };

  return (
    <form
      encType="multipart/form-data"
      onSubmit={handleSubmit}
      className="flex justify-center"
    >
      <div>
        <DynamicTable rows={rows} columns={columns} setRows={setRows} />
        <SubmButton />
      </div>
    </form>
  );
};

export default TripsForm;
