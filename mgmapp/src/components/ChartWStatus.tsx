import FlowChart from "./FlowChart";

const ChartWStatus = ({
  status,
  chartData,
}: {
  status: any;
  chartData: any;
}) => {
  return (
    <div>
      <div className="flex padding-table">
        <h1 className="bright-text">Stanje: </h1>
        <h1 className={Number(status) < 0 ? "red-text" : "bright-text"}>
          &nbsp; {status} &euro;
        </h1>
      </div>
      <div className="white padding-5 border-radius flex justify-center mw700 width-100">
        <FlowChart chartData={chartData} chartHeight={400} />
      </div>
    </div>
  );
};

export default ChartWStatus;
