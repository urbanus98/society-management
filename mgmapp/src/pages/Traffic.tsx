import UsefulTable from "../components/UsefulTable";
import { useEffect, useState } from "react";
import TrafficForm from "../components/Forms/TrafficForm";
import axios from "axios";
import LinkButton from "../components/ui/LinkButton";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export function CreateTraffic() {
  return (
    <div className="background padding-3 flex justify-center">
      <div className="res-width-2">
        <h1 className="text-center bright-text">Ustvari vnos</h1>
        <TrafficForm />
      </div>
    </div>
  );
}

export const UpdateTraffic = () => {
  const axiosPrivate = useAxiosPrivate();
  const [traffic, setTraffic] = useState<any>();
  const { id } = useParams();

  useEffect(() => {
    const fetchTraffic = async () => {
      try {
        const response = await axiosPrivate.get(`traffic/${id}`);
        setTraffic(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTraffic();
  }, [id]);

  return (
    <div className="background padding-3 flex justify-center">
      <div className="res-width-2">
        <h1 className="text-center bright-text">Uredi vnos</h1>
        <TrafficForm traffic={traffic} />
      </div>
    </div>
  );
};

export function Traffic() {
  const axiosPrivate = useAxiosPrivate();
  const [traffic, setTraffic] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const headers = ["Namen", "Znesek", "Datum", ""];

  useEffect(() => {
    axiosPrivate
      .get(`traffic`)
      .then((response) => {
        setTraffic(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="background padding-3">
      <div className="">
        <LinkButton text="Dodaj vnos" link="/traffic/create" />
      </div>
      <div className="grid-2">
        <div>
          <UsefulTable
            headers={headers}
            rows={traffic.incoming}
            title="Prilivi"
            linkPart="traffic"
            linkIndex={3}
          />
        </div>
        <div>
          <UsefulTable
            headers={headers}
            rows={traffic.outgoing}
            title="Odlivi"
            linkPart="traffic"
            linkIndex={3}
          />
        </div>
      </div>
    </div>
  );
}
