import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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
}

// const color = index % 2 === 0 ? "#62bf62" : "#e60707";

const BarChart = ({
  labels,
  chartData,
  labelKey,
  monetary,
  title,
  colors = ["#32a852", "#8a1313"],
}: Props) => {
  const barLabels = chartData.map((row) => row[labelKey]);
  const dataSets = labels.map((data, index) => {
    if (chartData.length === 0) {
      return { label: "", data: [], backgroundColor: "", borderColor: "" };
    }
    return {
      label: data.label,
      data: chartData.map((item) => item[data.key] || 0), // Fallback to 0 if undefined
      backgroundColor: colors[index % colors.length],
      borderColor: colors[index % colors.length],
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

  return <Bar data={data} options={options} />;
};

export default BarChart;
