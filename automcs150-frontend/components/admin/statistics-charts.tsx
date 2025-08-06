"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart, ChartContainer } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    usdot: "12345",
    downloads: 120,
    users: 3,
  },
  {
    usdot: "67890",
    downloads: 98,
    users: 2,
  },
  {
    usdot: "54321",
    downloads: 86,
    users: 1,
  },
  {
    usdot: "98765",
    downloads: 75,
    users: 2,
  },
  {
    usdot: "13579",
    downloads: 65,
    users: 1,
  },
  {
    usdot: "24680",
    downloads: 55,
    users: 1,
  },
  {
    usdot: "11223",
    downloads: 45,
    users: 1,
  },
]

export function StatisticsCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>PDF Downloads by USDOT</CardTitle>
          <CardDescription>Top USDOT numbers by PDF generation count</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart className="h-[300px]">
            <ChartContainer>
              <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="usdot" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="downloads" fill="#0055a4" name="Downloads" />
              </BarChart>
            </ChartContainer>
          </Chart>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Users per USDOT</CardTitle>
          <CardDescription>Number of users generating PDFs per USDOT</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart className="h-[300px]">
            <ChartContainer>
              <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="usdot" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#00a8e8" name="Users" />
              </BarChart>
            </ChartContainer>
          </Chart>
        </CardContent>
      </Card>
    </div>
  )
}
