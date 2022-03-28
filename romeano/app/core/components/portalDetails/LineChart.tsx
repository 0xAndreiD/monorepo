import React from "react"
import { Line } from "react-chartjs-2"
import { Card, CardHeader } from "../generic/Card"
import "chartjs-adapter-date-fns"

//see https://www.chartjs.org/docs/latest/samples/line/line.html
export default function LineChart(props: { data: Array<{ x: Date; y: number }> }) {
  const chartData = {
    labels: props.data.map((pt) => pt.x),
    datasets: [
      {
        label: "Clicks",
        fill: false,
        data: props.data.map((pt) => pt.y),
        borderColor: "#34D399",
        backgroundColor: "#34D399",
      },
    ],
  }

  return (
    <Card borderless={true} className="px-4 py-3 sm:p-6">
      <CardHeader classNameAddition="text-xl pb-2"></CardHeader>
      <Line
        data={chartData}
        options={{
          animation: false,
          responsive: true,
          scales: {
            x: {
              type: "time",
              position: "bottom",
              ticks: {
                maxRotation: 0,
              },
            },
            y: {
              display: true,
            },
          },
        }}
      />
    </Card>
  )
}
