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

// 🟢 Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DebtChart = ({ debtData }: { debtData: any }) => {
  const labels = debtData.map((debt: any) => debt.name);
  const credit = debtData.map((debt: any) => debt.credit);
  const debt = debtData.map((debt: any) => -debt.debt);
  const tCost = debtData.map((cost: any) => Math.round(cost.tripCosts));

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Potni stroški",
        data: tCost,
        backgroundColor: "#fcce03",
      },
      {
        label: "Prilivi",
        data: credit,
        backgroundColor: "#32a852",
      },
      {
        label: "Odlivi",
        data: debt,
        backgroundColor: "#8a1313",
      },
    ],
  };

  const options = {
    maintainAspectRatio: true,
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

  return <Bar data={data} options={options} />;
};

export default DebtChart;
