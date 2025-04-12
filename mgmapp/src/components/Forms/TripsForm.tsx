import { useEffect, useState } from "react";
import DynamicTable from "../ui/DynamicTable";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import SubmButton from "../ui/SubmButton";
import useAuth from "../../hooks/useAuth";

interface Props {
  eventId: any;
  setMsg?: any;
  setAlertVisibility?: any;
  setAlertColor?: any;
}

const TripsForm = ({
  eventId,
  setMsg,
  setAlertVisibility,
  setAlertColor,
}: Props) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [removedTripIds, setRemovedTripIds] = useState<any[]>([]); // Persist across renders

  const [tripsVisible, setTripsVisible] = useState(false);

  const [firstInsert, setFirstInsert] = useState<boolean>(true);
  const [locations, setLocations] = useState<any[]>([{}]);
  const [rows, setRows] = useState<any[]>([
    { origin: 1, destination: "", mileage: "", return: true },
  ]);

  useEffect(() => {
    const getLocations = async () => {
      const response = await axiosPrivate.get("/data/locations");
      console.log(response.data);
      setLocations(response.data);
    };
    const getTrips = async () => {
      const response = await axiosPrivate.get(`/trips/${eventId}`);
      console.log(response?.data);
      const newRows = formatRows(response.data);
      if (newRows.length > 0) {
        setFirstInsert(false);
        setRows(newRows);
        setTripsVisible(true);
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
    shortHeader?: string;
    key: string;
    placeholder?: string;
    values?: any[];
    type: string;
    classes?: string;
    disabled?: boolean;
    disabledOption?: boolean;
    onChange?: (rowIndex: number, selectedValue: string) => void;
  }[] = [
    {
      header: "Povratna",
      shortHeader: "Povr.",
      key: "return",
      type: "checkbox",
      classes: "bigcheck",
    },
    {
      header: "Start",
      key: "origin",
      placeholder: "Začetna lokacija",
      type: "select",
      values: locations,
      classes: "width-100",
      // classes: "w150",
    },
    {
      header: "Cilj",
      key: "destination",
      placeholder: "Končna lokacija",
      type: "select",
      values: locations,
      classes: "width-100",
      disabledOption: true,
      onChange: (rowIndex: number, selectedValue: string) => {
        changePrice(rowIndex, selectedValue);
      },
    },
    {
      header: "Kilometraža",
      shortHeader: "Km",
      key: "mileage",
      placeholder: "Razdalja",
      type: "number",
      classes: "w100",
    },
  ];

  const changePrice = (rowIndex: number, selectedValue: string) => {
    console.log("rowIndex: " + rowIndex);
    console.log("selectedValue: " + selectedValue);
    // Find the selected stuff type
    const selectedLocation = locations.find(
      (location) => location.id.toString() === selectedValue
    );
    if (selectedLocation && selectedLocation.distance) {
      // Update the distance for this row
      setRows((prevRows) => {
        const newRows = [...prevRows];
        newRows[rowIndex] = {
          ...newRows[rowIndex],
          mileage: selectedLocation.distance,
        };
        return newRows;
      });
    }
  };

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
      // console.log(formData);
      if (firstInsert) {
        response = await axiosPrivate.post("/trips", formData);
      } else {
        response = await axiosPrivate.put(`/trips/${eventId}`, formData);
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
      className="coluflex width-100 margin-tb1"
    >
      <h4
        className="bright-text pointer"
        onClick={() => setTripsVisible(!tripsVisible)}
      >
        Poti
      </h4>
      {tripsVisible && (
        <div className="width-100">
          <DynamicTable rows={rows} columns={columns} setRows={setRows} />
          <SubmButton />
        </div>
      )}
    </form>
  );
};

export default TripsForm;
