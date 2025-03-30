import { useEffect, useState } from "react";
import TrafficForm from "../components/Forms/TrafficForm";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import SubNavigator from "../components/SubNavigator";
import TrafficUpdateForm from "../components/Forms/TrafficUpdateForm";
import { Loading } from "../components/Loading";
import BackWTitle from "../components/BackWTitle";
import UsefulFinanceTable from "../components/UsefulFinanceTable";
import ChartWStatus from "../components/ChartWStatus";

export function Traffic() {
  const axiosPrivate = useAxiosPrivate();
  const [traffic, setTraffic] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const left = { link: "/finance", text: "Računi" };
  const right = { link: "/traffic", text: "Promet" };
  const [status, setStatus] = useState(0);
  const [traffiC, setTraffiC] = useState<any[]>([]);

  const headers = [
    { key: "date", label: "Datum" },
    { key: "amount", label: "Znesek" },
    { key: "name", label: "Namen" },
    { key: "id", label: "" },
  ];

  useEffect(() => {
    const getTraffic = async () => {
      try {
        const response = await axiosPrivate.get("traffic");
        setTraffic(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    const getBlackChart = async () => {
      const response = await axiosPrivate.get("traffic/chart");
      setTraffiC(response.data);
      console.log(response.data);
      setStatus(response.data[response.data.length - 1].cumulative_balance);
    };

    getTraffic();
    getBlackChart();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="padding-3">
      <SubNavigator left={left} right={right} disabled={0b10} margin />
      <div className="grid-2">
        <ChartWStatus chartData={traffiC} status={status} />
        <UsefulFinanceTable
          headers={headers}
          rows={traffic}
          linkPart="traffic"
          buttonLink="/traffic/create"
          buttonText="Ustvari vnos"
          title="Promet"
        />
      </div>
    </div>
  );
}

export function CreateTraffic() {
  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Ustvari vnos" />
      <div className="res-width-30">
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
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Uredi vnos" />
      <div className="res-width-30">
        <TrafficUpdateForm traffic={traffic} />
      </div>
    </div>
  );
};
