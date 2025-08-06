"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { CategoricalChartState } from "recharts/types/chart/types";
import { useRouter } from "next/navigation"

interface BarChartProps {
  data: Array<{ name: string; value: number }>
  dimension: string
}

export default function BarChartComponent({ data, dimension }: BarChartProps) {
  const router = useRouter()

  // Sort data for better visualization if needed
  const sortedData = [...data].sort((a, b) => b.value - a.value)

  // Limit to top 10 if there are too many items
  const displayData = sortedData.length > 10 ? sortedData.slice(0, 10) : sortedData

  const handleFilingHistory = (event: CategoricalChartState) => {
    router.push(`/admin/statistics/${event.activeLabel?.toLowerCase()}`)
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }} onDoubleClick={handleFilingHistory}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={70}
          label={{
            value:
              dimension === "usdot"
                ? "USDOT Number"
                : dimension === "user"
                  ? "User"
                  : dimension === "year"
                    ? "Year"
                    : dimension === "month"
                      ? "Month"
                      : "Day of Month",
            position: "insideBottom",
            offset: -10,
          }}
        />
        <YAxis
          label={{
            value: "PDF Generations",
            angle: -90,
            position: "insideLeft",
            dy: 80
          }}
        />
        <Tooltip
          labelStyle={{
            color: "red"
          }}
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
        <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
