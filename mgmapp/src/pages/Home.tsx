import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Select from "../components/ui/Select";
import BarChart from "../components/charts/BarChart";
import LineChart from "../components/charts/LineChart";
import PieChart from "../components/charts/PieChart";
import FuncButton from "../components/ui/FuncButton";
import LinkButton from "../components/ui/LinkButton";
import ImageLink from "../components/ui/ImageLink";

export const Home = () => {
  const axiosPrivate = useAxiosPrivate();

  // * GENERAL *
  const [years, setYears] = useState([]);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [trafficType, setTrafficType] = useState("traffic");

  // * TOTAL TRAFFIC *
  const [totalTraffic, setTotalTraffic] = useState<any[]>([]);
  const [totalBlackTraffic, setTotalBlackTraffic] = useState<any[]>([]);
  const colorsPlusMinus = ["#32a852", "#8a1313"];
  const trafficLabelsTotal = [
    { key: "inflow", label: "Prihodki" },
    { key: "outflow", label: "Stroški" },
  ];
  const chartTitle = trafficType === "traffic" ? "Promet" : "Črni promet";
  const currentTotalTraffic =
    trafficType === "traffic" ? totalTraffic : totalBlackTraffic;

  // * TOTAL BALANCE *
  const [whiteBalance, setWhiteBalance] = useState<string>("");
  const [blackBalance, setBlackBalance] = useState<string>("");
  const balance = trafficType === "traffic" ? whiteBalance : blackBalance;

  // * SALES BY SIZE *
  const [sizeSales, setSizeSales] = useState<any[]>([]);
  const sizeSaleLabels = [{ key: "quantity", label: "Št. majic" }];

  // * TOTAL VS CURRENT TABLE *
  const [mileages, setMileages] = useState<any[]>([]);
  const [totalSalesProfit, setTotalSalesProfit] = useState<any[]>([]);
  const [totalMMZFunds, setTotalMMZFunds] = useState<any[]>([]);

  // * YEARLY TRAFFIC *
  const [yearlyTraffic, setYearlyTraffic] = useState<any[]>([]);
  const [yearlyBlackTraffic, setYearlyBlackTraffic] = useState<any[]>([]);
  const yearlyTrafficLabels = [{ key: "balance", label: `Stanje ${year}` }];
  const trafficDataYearly =
    trafficType === "traffic" ? yearlyTraffic : yearlyBlackTraffic;

  // * YEARLY EVENTS *
  const [yearlyEvents, setYearlyEvents] = useState<any[]>([]);
  const [yearlyHours, setYearlyHours] = useState<any[]>([]);
  const yearlyEventsLabel = { key: "total", label: "Število" };
  const [eventInfo, setEventInfo] = useState("count");
  const eventsData = eventInfo === "count" ? yearlyEvents : yearlyHours;
  const eventsTitle =
    eventInfo === "count" ? "Št. tipov dogodkov" : "Št. opravljenih ur";

  const getBalanceFromTraffic = (traffic: any[]) => {
    const totalInflow = traffic.reduce(
      (acc: number, item: any) => acc + Number(item.inflow),
      0
    );
    const totalOutflow = traffic.reduce(
      (acc: number, item: any) => acc + Number(item.outflow),
      0
    );
    return (totalInflow + totalOutflow).toFixed(2);
  };

  useEffect(() => {
    const getYears = async () => {
      const response = await axiosPrivate.get(`stats/years`);
      setYears(response.data);
    };
    const getSalesBySize = async () => {
      const response = await axiosPrivate.get(`stats/sizes`);
      setSizeSales(response.data);
    };
    const getTotalSalesProfit = async () => {
      const response = await axiosPrivate.get(`stats/sales-profit`);
      const result = response.data.reduce((acc: any, item: any) => {
        acc[item.year] = item.profit;
        return acc;
      }, {});
      setTotalSalesProfit(result);
    };
    const getTraffic = async () => {
      try {
        const response = await axiosPrivate.get("stats/traffic");
        setTotalTraffic(response.data.traffic);
        setTotalBlackTraffic(response.data.black_traffic);

        setWhiteBalance(getBalanceFromTraffic(response.data.traffic));
        setBlackBalance(getBalanceFromTraffic(response.data.black_traffic));
      } catch (error) {
        console.error("Error fetching traffic:", error);
      }
    };
    const getMileages = async () => {
      const response = await axiosPrivate.get(`stats/mileage`);
      const result = response.data.reduce((acc: any, item: any) => {
        acc[item.year] = item.totalKm;
        return acc;
      }, {});
      setMileages(result);
    };
    const getMZZFunds = async () => {
      const response = await axiosPrivate.get(`stats/mzz`);
      const result = response.data.reduce((acc: any, item: any) => {
        acc[item.year] = item.funds;
        return acc;
      }, {});
      setTotalMMZFunds(result);
    };

    getYears();
    getTraffic();
    getMZZFunds();
    getMileages();
    getSalesBySize();
    getTotalSalesProfit();
  }, []);

  useEffect(() => {
    const getEvents = async () => {
      const response = await axiosPrivate.get(`stats/${year}/event`);
      setYearlyEvents(response.data.typeCount);
      setYearlyHours(response.data.typeHours);
    };
    const getYearlyTraffic = async () => {
      const response = await axiosPrivate.get(`stats/${year}/monthly-balances`);
      setYearlyTraffic(response.data.traffic);
      setYearlyBlackTraffic(response.data.black_traffic);
    };

    getYearlyTraffic();
    getEvents();
  }, [year]);

  return (
    <div className="padding-3">
      <h1 className="bright-text text-center mar-btm30">Nadzorna plošča</h1>

      <div className="grid-3 gap">
        <div className="black-back pad-1r border-radius mw700 width-100 span-2r coluflex gap justify-between">
          <div className="flex justify-between">
            <div className="flex gap align-center">
              <h4 className="bright-text margin-none">Podatki za leto:</h4>
              <Select
                defaultvalue={String(year)}
                onChange={(e) => setYear(parseInt(e.target.value))}
                values={years}
                withDisabled={false}
              />
            </div>
            <div className="flex gap-s">
              <FuncButton
                label="Belo"
                color="secondary"
                onClick={() => setTrafficType("traffic")}
                isDisabled={trafficType === "traffic"}
              />
              <FuncButton
                label="Črno"
                color="secondary"
                onClick={() => setTrafficType("black_traffic")}
                isDisabled={trafficType === "black_traffic"}
              />
            </div>
          </div>
          {/* LINE CHART */}
          <div className="minh300">
            <LineChart
              labels={yearlyTrafficLabels}
              chartData={trafficDataYearly}
              labelKey="month"
              title="Stanje"
              monetary={true}
            />
          </div>
          {/* PIE CHART */}
          <div className="flex wrap gap justify-center">
            <div className="minh200">
              <PieChart
                label={yearlyEventsLabel}
                chartData={eventsData}
                labelKey="type"
                dataKey="total"
                title={eventsTitle}
              />
            </div>
            <div className="flex wrap gap-s justify-between align-center">
              <div className="coluflex gap">
                <div className="flex gap-s">
                  <FuncButton
                    label="Dogodki"
                    color="secondary"
                    onClick={() => setEventInfo("count")}
                    isDisabled={eventInfo === "count"}
                  />
                  <FuncButton
                    label="Ure"
                    color="secondary"
                    onClick={() => setEventInfo("hours")}
                    isDisabled={eventInfo === "hours"}
                  />
                </div>
                <div className="coluflex gap-s" style={{ padding: 10 }}>
                  <h5 className="bright-text">Dogodki v letu {year}</h5>
                  {Array.isArray(eventsData) &&
                    eventsData.map((event) => (
                      <div key={event.type}>
                        <p className="bright-text">
                          {event.type}: {event.total}
                          {eventInfo === "hours" ? " ur" : "x"}
                        </p>
                      </div>
                    ))}
                  <hr className="bright-text margin-none" />
                  <p className="bright-text">
                    Skupaj:{" "}
                    {eventsData.reduce(
                      (acc, event) => acc + Number(event.total),
                      0
                    )}
                    {eventInfo === "hours" ? " ur" : "x"}
                  </p>
                </div>
                <div className="res-hide">
                  <LinkButton link="/events/create" text="Dodaj dogodek" />
                </div>
              </div>
              <div className="res-show glow-hover border-radius">
                <ImageLink
                  text="Dodaj dogodek"
                  link="/events/create"
                  imagePath="/public/images/event_w.png"
                  dark={true}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="white-back2 pad-1r border-radius width-100 minh300">
          <BarChart
            labels={sizeSaleLabels}
            chartData={sizeSales}
            labelKey="type"
            title={"Prodano po velikosti"}
            colors={["#46a3c2"]}
          />
        </div>
        <div className="coluflex width-100 gap">
          <div className="black-back border-radius pad-1r justify-center coluflex">
            <table className="bright-text">
              <tr>
                <th></th>
                <th>Leta {year}</th>
                <th>Skupaj</th>
              </tr>
              <tr>
                <td>Prevoženih:</td>
                <td>{mileages[year] ?? 0} km</td>
                <td>
                  {Object.values(mileages).reduce((sum, totalKm) => {
                    return sum + (Number(totalKm) || 0);
                  }, 0)}
                  {" km"}
                </td>
              </tr>
              <tr>
                <td>Merch profit:</td>
                <td>{totalSalesProfit[year] ?? 0} €</td>
                <td>
                  {Object.values(totalSalesProfit).reduce((sum, profit) => {
                    return sum + (Number(profit) || 0);
                  }, 0)}{" "}
                  €
                </td>
              </tr>
              <tr>
                <td>MZZ:</td>
                <td>
                  {totalMMZFunds[year] ?? 0}
                  {" €"}
                </td>
                <td>
                  {Object.values(totalMMZFunds).reduce((sum, funds) => {
                    return sum + (Number(funds) || 0);
                  }, 0)}
                  {" €"}
                </td>
              </tr>
            </table>
          </div>
          <div className="flex gap">
            <div className="black-back border-radius pad-1r flex justify-center width-50 glow-hover">
              <ImageLink
                text="Vnesi dolg"
                link="/debt-actions"
                imagePath="/public/images/debt_w.png"
                dark={true}
              />
            </div>
            <div className="black-back border-radius pad-1r flex justify-center width-50 glow-hover">
              <ImageLink
                text="Zabeleži prodajo"
                link="/merch/sales/create"
                imagePath="/public/images/sell_w.png"
                dark={true}
              />
            </div>
          </div>
        </div>
        <div className="white-back2 pad-1r border-radius width-100 minh300 span-2c">
          <h5 className="abs">Stanje: {balance}€</h5>
          <BarChart
            labels={trafficLabelsTotal}
            chartData={currentTotalTraffic}
            labelKey="year"
            title={chartTitle}
            monetary={true}
            colors={colorsPlusMinus}
          />
        </div>
      </div>
    </div>
  );
};
