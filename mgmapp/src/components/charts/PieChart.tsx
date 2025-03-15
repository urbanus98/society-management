import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";

// Register the required components for a pie chart
ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface Props {
  label: { key: string; label: string }; // Categories to display (e.g., [{ key: "inflow", label: "Prihodki" }, ...])
  chartData: any[]; // Data array with values for each category
  dataKey: string; // Key to extract the main value for each slice (e.g., "year", "month")
  labelKey: string; // Key to extract the main value for each slice (e.g., "year", "month")
  monetary?: boolean; // Format values as currency (with €)
  title?: string; // Chart title
  colors?: string[]; // Custom colors for the slices
}

const PieChart = ({
  label,
  chartData,
  dataKey,
  labelKey,
  monetary,
  title,
  colors = ["#46a3c2", "#f06456", "#e0ac0d", "#6b5b95", "#45bf6e"],
}: Props) => {
  //   console.log("PieChart props:", { chartData, label, labelKey });

  if (!Array.isArray(chartData) || chartData.length === 0) {
    // console.log("PieChart: chartData is invalid or empty");
    return <p>No data to display</p>;
  }

  // Generate labels and data for the pie chart
  const pieLabels = chartData.map((row) => row[labelKey] || "N/A");
  const pieData = chartData.map((row) => row[dataKey] || "N/A");

  const data = {
    labels: pieLabels,
    datasets: [
      {
        label: label.label || "Pie Chart",
        data: pieData,
        backgroundColor: colors.slice(0, pieLabels.length),
        borderColor: colors.slice(0, pieLabels.length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      title: title ? { display: true, text: title } : { display: false },
      tooltip: monetary
        ? {
            callbacks: {
              label: (context: any) => {
                let value = context.raw || 0;
                return `${context.label}: ${value.toLocaleString()} €`;
              },
            },
          }
        : {},
      legend: {
        position: "top" as const,
      },
    },
    responsive: true,
  };

  return <Pie data={data} options={options} />;
};

export default PieChart;
