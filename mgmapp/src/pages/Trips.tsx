import { useEffect, useState } from "react";
import BackWTitle from "../components/BackWTitle";
import LocationsForm from "../components/Forms/LocationsForm";
import MileageRatesForm from "../components/Forms/MileageRatesForm";
import Alert from "../components/ui/Alert";
import VersatileTable from "../components/ui/VersatileTable";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const Trips = () => {
  const axiosPrivate = useAxiosPrivate();
  const [trips, setTrips] = useState<any[]>([]);
  const headers = [
    { key: "date", label: "Datum" },
    { key: "event", label: "Dogodek" },
    { key: "route", label: "Poti" },
    { key: "mileage", label: "Razdalja" },
    { key: "user", label: "Voznik" },
  ];

  useEffect(() => {
    const getTrips = async () => {
      const response = await axiosPrivate.get("trips");
      setTrips(formatTrips(response.data));
      console.log(formatTrips(response.data));
    };

    getTrips();
  }, []);

  const formatTrips = (trips: any[]) => {
    const grouped: Record<
      string,
      {
        user: string;
        event: string;
        route: string;
        mileage: number;
        date: string;
      }
    > = {};

    trips.forEach(({ date, user, event, origin, destination, mileage }) => {
      const key = `${user}-${event}`;

      if (!grouped[key]) {
        grouped[key] = { date, user, mileage: 0, event, route: origin };
      }
      grouped[key].route += ` - ${destination}`;
      grouped[key].mileage += mileage;
    });

    return Object.values(grouped).map((trip) => ({
      ...trip,
      mileage: `${trip.mileage} km`,
    }));
  };

  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Zabeležene poti" />
      <div className="res-width-80">
        <VersatileTable headers={headers} rows={trips} linkPart="trips" />
      </div>
    </div>
  );
};

export const DataManegement = () => {
  const [alertVisible, setAlertVisibility] = useState(false);
  const [msg, setMsg] = useState("");
  const [alertColor, setAlertColor] = useState<any>("success");

  return (
    <div className="padding-3 coluflex align-center">
      <BackWTitle title="Upravljanje podatkov" />
      <div className="margin-tb2 res-width-60">
        {alertVisible && (
          <Alert color={alertColor} onClose={() => setAlertVisibility(false)}>
            {msg}
          </Alert>
        )}
      </div>
      <div className="flex wrap justify-between res-width-60">
        <div
          className="coluflex margin-auto-lr"
          style={{ marginBottom: "2rem" }}
        >
          <h2 className="bright-text text-center">Lokacije</h2>
          <LocationsForm
            setMsg={setMsg}
            setAlertVisibility={setAlertVisibility}
            setAlertColor={setAlertColor}
          />
        </div>
        <div
          className="coluflex margin-auto-lr"
          style={{ marginBottom: "2rem" }}
        >
          <h2 className="bright-text text-center">Kilometrine</h2>
          <MileageRatesForm
            setMsg={setMsg}
            setAlertVisibility={setAlertVisibility}
            setAlertColor={setAlertColor}
          />
        </div>
      </div>
    </div>
  );
};
