"use client"

import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

interface LineChartProps {
  data: Array<{ name: string; value: number }>
  dimension: string
}

export default function LineChartComponent({ data, dimension }: LineChartProps) {
  // Sort data based on dimension
  let sortedData = [...data]

  if (dimension === "day") {
    sortedData = sortedData.sort((a, b) => Number.parseInt(a.name) - Number.parseInt(b.name))
  } else if (dimension === "month") {
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    sortedData = sortedData.sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name))
  } else if (dimension === "year") {
    sortedData = sortedData.sort((a, b) => Number.parseInt(a.name) - Number.parseInt(b.name))
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          label={{
            value: dimension === "day" ? "Day of Month" : dimension === "month" ? "Month" : "Year",
            position: "insideBottom",
            offset: -10,
          }}
        />
        <YAxis
          label={{
            value: "PDF Generations",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <Tooltip formatter={(value) => [`${value} PDFs`, dimension.charAt(0).toUpperCase() + dimension.slice(1)]} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#4f46e5"
          strokeWidth={2}
          dot={{ r: 4, fill: "#4f46e5" }}
          activeDot={{ r: 6, fill: "#8b5cf6" }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
