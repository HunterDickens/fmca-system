"use client"

import { DashboardCards } from "@/components/admin/dashboard-cards"
import { RecentUsers } from "@/components/admin/recent-users"
import { WelcomeBanner } from "@/components/admin/welcome-banner"
import BarChartComponent from "@/components/chart/bar-chart"
import PieChartComponent from "@/components/chart/pie-chart"
import { useState, useMemo, useEffect } from "react"
import { generateMockData } from "@/lib/mock-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import axiosInstance from "@/axios/axiosInstance"
import { PdfGenerationRecord } from "@/lib/mock-data"

type FilterDimension = "user" | "day" | "usdot" | "month" | "year"

export default function DashboardPage() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [filterDimension, setFilterDimension] = useState<FilterDimension>("user")
  const [allData, setAllData] = useState<PdfGenerationRecord[]>()

  /* const allData = useMemo(() => generateMockData(), []) */

  const fetchChartData = async () => {
    await axiosInstance.get("/filing/get_pdf_statistics").then((response) => {
      if (response.status === 200) {
        setAllData(response.data.chartData)
      }
    })
  }

  const chartData = useMemo(() => {
    if (filterDimension === "user") {
      const data: Record<string, number> = {}
      allData?.forEach((item) => {
        data[item.user] = (data[item.user] || 0) + 1
      })
      return Object.entries(data).map(([user, count]) => ({ name: user, value: count }))
    }

    return []
  }, [filterDimension, allData])

  useEffect(() => {
    fetchChartData()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      {showWelcome && <WelcomeBanner onDismiss={() => setShowWelcome(false)} />}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        <DashboardCards />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              PDF Generations by{" "}
              {filterDimension === "usdot"
                ? "USDOT Number"
                : filterDimension === "user"
                  ? "User"
                  : filterDimension === "year"
                    ? "Year"
                    : filterDimension === "month"
                      ? "Month"
                      : "Day"}
            </CardTitle>
            {/* <CardDescription>
              {selectedUser !== "all" ? `User: ${selectedUser}` : "All users"} |
              {selectedUsdot !== "all" ? ` USDOT: ${selectedUsdot}` : " All USDOT numbers"} |
              {selectedYear !== "all" ? ` Year: ${selectedYear}` : " All years"} |
              {selectedMonth !== "all" ? ` Month: ${selectedMonth}` : " All months"} |
              {selectedDay !== "all" ? ` Day: ${selectedDay}` : " All days"}
            </CardDescription> */}
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="bar">
              <TabsList className="mb-4">
                <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                <TabsTrigger value="pie">Pie Chart</TabsTrigger>
                {(filterDimension === "day" || filterDimension === "month" || filterDimension === "year") && (
                  <TabsTrigger value="line">Line Chart</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="bar" className="h-[400px]">
                <BarChartComponent data={chartData} dimension={filterDimension} />
              </TabsContent>

              <TabsContent value="pie" className="h-[400px]">
                <PieChartComponent data={chartData} dimension={filterDimension} />
              </TabsContent>

            </Tabs>
          </CardContent>
        </Card>
        <RecentUsers />
      </div>
    </div>
  )
}
