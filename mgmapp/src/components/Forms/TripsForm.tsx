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
  const [refresh, setRefresh] = useState(false);

  const [tripsVisible, setTripsVisible] = useState(false);

  const [firstInsert, setFirstInsert] = useState<boolean>(true);
  const [locations, setLocations] = useState<any[]>([{}]);
  const [rows, setRows] = useState<any[]>([
    { origin: 1, destination: "", mileage: "", return: true },
  ]);

  useEffect(() => {
    const getLocations = async () => {
      const response = await axiosPrivate.get("/api/data/locations");
      setLocations(response.data);
    };
    const getTrips = async () => {
      const response = await axiosPrivate.get(`/api/trips/${eventId}`);
      console.log(response?.data);
      const newRows = formatRows(
        response.data.filter((trip: any) => trip.user_id == auth.id) // show only this user's trips
      );
      if (newRows.length > 0) {
        setFirstInsert(false);
        setRows(newRows);
        setTripsVisible(true);
      }
    };

    getLocations();
    getTrips();
  }, [refresh]);

  const formatRows = (rows: any) => {
    const newRows: any[] = [];
    const seen = new Set();

    rows.forEach((trip: any) => {
      if (seen.has(trip.id)) return; // Skip rows that were already paired

      // Find a trip with switched origin and destination
      const tripBack = rows.find(
        (tripBack: any) =>
          tripBack.origin_id === trip.destination_id &&
          tripBack.destination_id === trip.origin_id &&
          !seen.has(tripBack.id)
      );

      if (tripBack) {
        // Mark the first occurrence as a return trip
        newRows.push({
          id: trip.id,
          origin: trip.origin_id,
          destination: trip.destination_id,
          mileage: trip.mileage,
          return: true,
        });

        // Mark the second row as processed
        seen.add(tripBack.id);
        setRemovedTripIds((prev) => [...prev, tripBack.id]); // Correctly updates state
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
    });

    console.log(newRows);
    return newRows;
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
    required?: boolean;
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
      required: true,
    },
    {
      header: "Cilj",
      key: "destination",
      placeholder: "Končna lokacija",
      type: "select",
      values: locations,
      classes: "width-100",
      required: true,
      disabledOption: true,
      onChange: (rowIndex: number, selectedValue: string) => {
        changeDistance(rowIndex, selectedValue);
      },
    },
    {
      header: "Kilometraža",
      shortHeader: "Km",
      key: "mileage",
      placeholder: "Razdalja",
      type: "number",
      required: true,
      classes: "w100",
    },
  ];

  const changeDistance = (rowIndex: number, selectedValue: string) => {
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
    return rows.flatMap((row: any) => {
      if (row.return) {
        return [
          row,
          {
            origin: row.destination,
            destination: row.origin,
            mileage: row.mileage,
            return: true,
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
      if (firstInsert) {
        response = await axiosPrivate.post("/api/trips", formData);
      } else {
        response = await axiosPrivate.put(`/api/trips/${eventId}`, formData);
      }
      setAlertColor("success");
      setMsg(response.data.message);
      setRefresh((prev) => !prev);
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
