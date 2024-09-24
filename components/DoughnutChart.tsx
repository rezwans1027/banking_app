"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ accounts }) => {
  const accountNames = accounts.map((a) => a.name);
  const balances = accounts.map((a) => a.currentBalance);

  const data = {
    datasets: [
      {
        label: "Banks",
        data: balances,
        backgroundColor: ["#0747b5", "#2265d8", "#2f91fa"],
      },
    ],
    labels: accountNames,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Important for custom sizing
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div style={{ width: "100px", height: "100px" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;
