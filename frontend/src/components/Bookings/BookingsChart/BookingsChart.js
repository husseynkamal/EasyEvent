import React from "react";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { CategoryScale } from "chart.js";

import "./BookingsChart.css";

Chart.register(CategoryScale);

const BOOKING_BUCKETS = {
  Cheap: { min: 0, max: 100, color: "rgb(255, 99, 132)" },
  Normal: { min: 100, max: 200, color: "rgb(15, 202, 93)" },
  Expensive: { min: 200, max: 1000000, color: "rgb(81, 1, 209)" },
};

const BookingsChart = ({ bookings }) => {
  const chartData = { labels: [], datasets: [] };
  let values = [];

  for (const bucket in BOOKING_BUCKETS) {
    const filteredBookingsCount = bookings.reduce((acc, curr) => {
      if (
        curr.event.price > BOOKING_BUCKETS[bucket].min &&
        curr.event.price < BOOKING_BUCKETS[bucket].max
      ) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);

    values.push(filteredBookingsCount);
    chartData.labels.push(bucket);
    chartData.datasets.push({
      label: bucket,
      backgroundColor: BOOKING_BUCKETS[bucket].color,
      borderColor: BOOKING_BUCKETS[bucket].color,
      data: values,
    });
    values = [...values];
    values[values.length - 1] = 0;
  }

  return (
    <div className="chart-content">
      <Bar data={chartData} />
    </div>
  );
};

export default BookingsChart;
