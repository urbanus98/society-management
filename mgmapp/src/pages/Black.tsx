import { useEffect, useState } from "react";
import SubNavigator from "../components/SubNavigator";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import FlowChart from "../components/charts/FlowChart";
import FlowForm from "../components/Forms/FlowForm";
import { useParams } from "react-router-dom";
import BackWTitle from "../components/BackWTitle";
import UsefulFinanceTable from "../components/UsefulFinanceTable";
import ChartWStatus from "../components/ChartWStatus";

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
    { key: "user", label: "Uporabnik" },
    { key: "id", label: "" },
  ];

  useEffect(() => {
    const getBlackFlow = async () => {
      const response = await axiosPrivate.get("black");
      setBlack(response.data);
      // console.log(response.data);
    };

    const getBlackChart = async () => {
      const response = await axiosPrivate.get("black/chart");
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
    <div className="padding-3">
      <BackWTitle title="Zabeleži črni promet" />
      <div className="flex justify-center align-center height-100">
        <FlowForm />
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
      const response = await axiosPrivate.get(`black/flow/${id}`);
      console.log(response.data);
      setFlow(response.data);
    };

    getBlackFlow();
  }, []);

  return (
    <div className="padding-3">
      <BackWTitle title="Uredi črni promet" />
      <div className="flex justify-center align-center height-100">
        <FlowForm flow={flow} />
      </div>
    </div>
  );
};
