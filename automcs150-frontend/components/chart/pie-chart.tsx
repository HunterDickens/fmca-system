"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface PieChartProps {
  data: Array<{ name: string; value: number }>
  dimension: string
}

export default function PieChartComponent({ data, dimension }: PieChartProps) {
  // Sort data for better visualization
  const sortedData = [...data].sort((a, b) => b.value - a.value)

  // Limit to top 8 if there are too many items, and group the rest as "Others"
  let displayData = sortedData
  if (sortedData.length > 8) {
    const topItems = sortedData.slice(0, 7)
    const otherItems = sortedData.slice(7)
    const otherValue = otherItems.reduce((sum, item) => sum + item.value, 0)
    displayData = [...topItems, { name: "Others", value: otherValue }]
  }

  // Generate vibrant colors
  const COLORS = [
    "#4f46e5", // Indigo
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#f43f5e", // Rose
    "#ef4444", // Red
    "#f97316", // Orange
    "#f59e0b", // Amber
    "#10b981", // Emerald
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={displayData}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {displayData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [
            `${value} PDFs`,
            dimension === "usdot"
              ? "USDOT Number"
              : dimension === "user"
                ? "User"
                : dimension === "year"
                  ? "Year"
                  : dimension === "month"
                    ? "Month"
                    : "Day",
          ]}
        />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
      </PieChart>
    </ResponsiveContainer>
  )
}
