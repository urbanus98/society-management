import {
  Chart as ChartJS,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// 🟢 Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FlowChart = ({
  chartData,
  chartHeight = 300,
}: {
  chartData: any;
  chartHeight?: any;
}) => {
  const dates = chartData.map((black: any, index: any) =>
    index > 0 && black.month_year === chartData[index - 1].month_year
      ? ""
      : black.month_year
  );
  const status = chartData.map((black: any) =>
    black.cumulative_balance != null ? black.cumulative_balance : "0"
  );

  // console.log(dates);
  // console.log(status);

  const data = {
    labels: dates,
    datasets: [
      {
        label: "Stanje",
        data: status,
        backgroundColor: "#d4cb22",
        borderColor: "#d4cb22",
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Dolgovi",
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let value = context.raw || 0;
            return `${value.toLocaleString()} €`;
          },
        },
      },
    },
    responsive: true,
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        ticks: {
          callback: (value: any) => `${value.toLocaleString()} €`,
        },
      },
    },
  };

  return <Line data={data} options={options} height={chartHeight} />;
};

export default FlowChart;
