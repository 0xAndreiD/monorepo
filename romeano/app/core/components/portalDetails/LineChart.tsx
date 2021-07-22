import React from "react"
import { Line } from "react-chartjs-2"
import "chartjs-adapter-date-fns"
import { Card, CardHeader } from "../generic/Card"

const options = {
  animation: false,
  responsive: true,
  scales: {
    x: {
      type: "time",
      position: "bottom",
      ticks: {
        maxRotation: 0
      }
    },
    y: {
      display: true
    }
  }
}

export default function LineChart(props: { data: Array<{ x: Date, y: number }> }) {
  const chartData = {
    datasets: [{
      label: "Clicks",
      fill: false,
      data: props.data,
      borderColor: "#34D399",
      backgroundColor: "#34D399"
    }]
  }

  return <Card borderless>
    <CardHeader>
      Overall Engagement
    </CardHeader>
    <Line data={chartData} options={options} type="line" />
  </Card>
}

