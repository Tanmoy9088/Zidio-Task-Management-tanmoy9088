import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const StatusBreakdownChart = ({ tasks }) => {
  const statuses = ["pending", "in progress", "completed", "review"];
  const counts = statuses.map(
    (status) => tasks.filter((t) => t.status === status).length
  );

  const data = {
    labels: statuses.map((s) => s.toUpperCase()),
    datasets: [
      {
        label: "Task Status",
        data: counts,
        backgroundColor: ["#FFC107", "#00BFFF", "#4CAF50", "#FF69B4"],
      },
    ],
  };

  return (
    <div className="bg-glass p-4 rounded-xl text-white shadow-md w-full">
      <h3 className="text-lg font-bold text-white mb-2">
        🧮 Task Status Breakdown
      </h3>
      <Bar
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: { labels: { color: "#ffffff" } },
          },
          scales: {
            x: { ticks: { color: "#ffffff" } },
            y: { ticks: { color: "#ffffff" } },
          },
        }}
      />
    </div>
  );
};

export default StatusBreakdownChart;
