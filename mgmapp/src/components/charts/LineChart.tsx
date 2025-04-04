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

interface Props {
  labels: any[];
  chartData: any[];
  labelKey: string;
  monetary?: boolean;
  title?: string;
  colors?: string[];
  chartHeight?: any;
}

const LineChart = ({
  labels,
  chartData,
  labelKey,
  monetary,
  title,
  colors = ["#32a852", "#8a1313"],
}: Props) => {
  const barLabels = chartData.map((row) => row[labelKey]);
  const dataSets = labels.map((data) => {
    if (chartData.length === 0) {
      return { label: "", data: [], backgroundColor: "", borderColor: "" };
    }
    return {
      label: data.label,
      data: chartData.map((item) => item[data.key] || 0),
      backgroundColor:
        chartData[chartData.length - 1][data.key] > 0 ? colors[0] : colors[1],
      borderColor:
        chartData[chartData.length - 1][data.key] > 0 ? colors[0] : colors[1],
    };
  });

  const data = {
    labels: barLabels,
    datasets: dataSets,
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      title: title
        ? {
            display: true,
            text: title,
          }
        : {
            display: false,
          },
      tooltip: monetary
        ? {
            callbacks: {
              label: (context: any) => {
                let value = context.raw || 0;
                return `${value.toLocaleString()} €`;
              },
            },
          }
        : {},
    },
    responsive: true,
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        ticks: monetary
          ? {
              callback: (value: any) => `${value.toLocaleString()} €`,
            }
          : {},
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
