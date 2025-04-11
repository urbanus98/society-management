import { useEffect, useState } from "react";
import BackWTitle from "../components/BackWTitle";
import VersatileTable from "../components/ui/VersatileTable";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const Trips = () => {
  const axiosPrivate = useAxiosPrivate();
  const [trips, setTrips] = useState<any[]>([]);
  const headers = [
    { key: "date", label: "Datum" },
    { key: "event", label: "Dogodek" },
    { key: "route", label: "Poti", hideOnMobile: true },
    { key: "mileage", label: "Razdalja", hideOnMobile: true },
    { key: "user", label: "Voznik" },
  ];

  useEffect(() => {
    const getTrips = async () => {
      const response = await axiosPrivate.get("/trips");
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
