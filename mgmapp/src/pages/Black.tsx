import { useEffect, useState } from "react";
import SubNavigator from "../components/SubNavigator";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useParams } from "react-router-dom";
import BackWTitle from "../components/BackWTitle";
import UsefulFinanceTable from "../components/UsefulFinanceTable";
import ChartWStatus from "../components/ChartWStatus";
import BlackTrafficForm from "../components/Forms/BlackTrafficForm";

const left = { link: "/debt-actions", text: "Vnesi dolg" };
const right = { link: "/debts", text: "Dolgovi" };

export const Black = () => {
  const axiosPrivate = useAxiosPrivate();
  const [black, setBlack] = useState<any[]>([]);
  const [blackStatus, setBlackStatus] = useState<any>("");
  const [blackC, setBlackC] = useState<any[]>([]);
  const headers = [
    { key: "date", label: "Datum" },
    { key: "amount", label: "Znesek" },
    { key: "name", label: "Razlog" },
    { key: "user", label: "Od/prilivalec", hideOnMobile: true },
    { key: "id", label: "" },
  ];

  useEffect(() => {
    const getBlackFlow = async () => {
      const response = await axiosPrivate.get("/api/black");
      setBlack(response.data);
      console.log(response.data);
    };

    const getBlackChart = async () => {
      const response = await axiosPrivate.get("/api/black/chart");
      setBlackC(response.data);
      console.log(response.data);
      setBlackStatus(
        response.data[response.data.length - 1].cumulative_balance
      );
    };

    getBlackFlow();
    getBlackChart();
  }, []);

  return (
    <div className="padding-3">
      <SubNavigator left={left} right={right} title="Črni fond" margin />
      <div className="grid-2">
        <ChartWStatus chartData={blackC} status={blackStatus} />
        <UsefulFinanceTable
          headers={headers}
          rows={black}
          linkPart="black/flow"
          buttonText="Vnesi pri/odliv"
          buttonLink="/black/flow/create"
        />
      </div>
    </div>
  );
};

export const CreateBlackFlow = () => {
  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Zabeleži črni promet" />
      <div className="res-width-30">
        <BlackTrafficForm />
      </div>
    </div>
  );
};

export const UpdateBlackFlow = () => {
  const axiosPrivate = useAxiosPrivate();
  const { id } = useParams();
  const [flow, setFlow] = useState<any>();

  useEffect(() => {
    const getBlackFlow = async () => {
      const response = await axiosPrivate.get(`/api/black/flow/${id}`);
      console.log(response.data);
      setFlow(response.data);
    };

    getBlackFlow();
  }, []);

  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Uredi črni promet" />
      <div className="res-width-30">
        <BlackTrafficForm flow={flow} />
      </div>
    </div>
  );
};
