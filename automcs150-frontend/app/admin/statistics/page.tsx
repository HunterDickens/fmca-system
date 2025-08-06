"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BarChartComponent from "@/components/chart/bar-chart"
import PieChartComponent from "@/components/chart/pie-chart"
import LineChartComponent from "@/components/chart/line-chart"
import { PdfGenerationRecord } from "@/lib/mock-data"
import axiosInstance from "@/axios/axiosInstance"

// Filter types
type FilterDimension = "user" | "day" | "usdot" | "month" | "year"

export default function StatisticsPage() {
  // Generate mock data
  /* const allData = useMemo(() => generateMockData(), [])
  console.log(allData) */

  // State for filter selections
  const [filterDimension, setFilterDimension] = useState<FilterDimension>("user")
  const [selectedUser, setSelectedUser] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [selectedDay, setSelectedDay] = useState<string>("all")
  const [selectedUsdot, setSelectedUsdot] = useState<string>("all")
  const [allData, setAllData] = useState<PdfGenerationRecord[]>()

  // Get unique values for filters
  const users = useMemo(() => ["all", ...new Set(allData?.map((item) => item.user))], [allData])
  const years = useMemo(() => ["all", ...new Set(allData?.map((item) => item.year))], [allData])

  // Get months based on selected year
  const availableMonths = useMemo(() => {
    if (selectedYear === "all") {
      return ["all", ...new Set(allData?.map((item) => item.month))]
    }
    return [
      "all",
      ...new Set(
        allData?.filter((item) => selectedYear === "all" || item.year === selectedYear).map((item) => item.month),
      ),
    ]
  }, [allData, selectedYear])

  const fetchChartData = async () => {
    await axiosInstance.get("/filing/get_pdf_statistics").then((response) => {
      if (response.status === 200) {
        setAllData(response.data.chartData)
      }
    })
  }

  // Get days based on selected year and month
  const availableDays = useMemo(() => {
    let filtered = allData

    if (selectedYear !== "all") {
      filtered = filtered?.filter((item) => item.year === selectedYear)
    }

    if (selectedMonth !== "all") {
      filtered = filtered?.filter((item) => item.month === selectedMonth)
    }

    return ["all", ...new Set(filtered?.map((item) => item.day))]
  }, [allData, selectedYear, selectedMonth])

  const usdotNumbers = useMemo(() => ["all", ...new Set(allData?.map((item) => item.usdot))], [allData])

  // Reset dependent filters when parent filter changes
  const handleYearChange = (year: string) => {
    setSelectedYear(year)
    setSelectedMonth("all")
    setSelectedDay("all")
  }

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month)
    setSelectedDay("all")
  }

  // Filter data based on selections
  const filteredData = useMemo(() => {
    let filtered = [...allData || []]

    if (selectedUser !== "all") {
      filtered = filtered.filter((item) => item.user === selectedUser)
    }

    if (selectedYear !== "all") {
      filtered = filtered.filter((item) => item.year === selectedYear)
    }

    if (selectedMonth !== "all") {
      filtered = filtered.filter((item) => item.month === selectedMonth)
    }

    if (selectedDay !== "all") {
      filtered = filtered.filter((item) => item.day === selectedDay)
    }

    if (selectedUsdot !== "all") {
      filtered = filtered.filter((item) => item.usdot === selectedUsdot)
    }

    return filtered
  }, [allData, selectedUser, selectedYear, selectedMonth, selectedDay, selectedUsdot])

  // Prepare data for charts based on selected dimension
  const chartData = useMemo(() => {
    if (filterDimension === "usdot") {
      const data: Record<string, number> = {}
      filteredData.forEach((item) => {
        data[item.usdot] = (data[item.usdot] || 0) + 1
      })
      return Object.entries(data).map(([usdot, count]) => ({ name: usdot, value: count }))
    }

    if (filterDimension === "user") {
      const data: Record<string, number> = {}
      filteredData.forEach((item) => {
        data[item.user] = (data[item.user] || 0) + 1
      })
      return Object.entries(data).map(([user, count]) => ({ name: user, value: count }))
    }

    if (filterDimension === "day") {
      const data: Record<string, number> = {}
      filteredData.forEach((item) => {
        data[item.day] = (data[item.day] || 0) + 1
      })
      return Object.entries(data)
        .map(([day, count]) => ({ name: day, value: count }))
        .sort((a, b) => Number.parseInt(a.name) - Number.parseInt(b.name))
    }

    if (filterDimension === "month") {
      const data: Record<string, number> = {}
      filteredData.forEach((item) => {
        data[item.month] = (data[item.month] || 0) + 1
      })
      return Object.entries(data)
        .map(([month, count]) => ({ name: month, value: count }))
        .sort((a, b) => {
          const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          return monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name)
        })
    }

    if (filterDimension === "year") {
      const data: Record<string, number> = {}
      filteredData.forEach((item) => {
        data[item.year] = (data[item.year] || 0) + 1
      })
      return Object.entries(data)
        .map(([year, count]) => ({ name: year, value: count }))
        .sort((a, b) => Number.parseInt(a.name) - Number.parseInt(b.name))
    }

    return []
  }, [filteredData, filterDimension])

  useEffect(() => {
    fetchChartData()
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-slate-100 p-4 rounded-lg border dark:bg-transparent">
              <p className="text-sm text-slate-500">Total PDF Generations</p>
              <p className="text-3xl font-bold">{filteredData.length}</p>
            </div>
            <div className="bg-slate-100 p-4 rounded-lg border dark:bg-transparent">
              <p className="text-sm text-slate-500">Unique USDOT Numbers</p>
              <p className="text-3xl font-bold">{new Set(filteredData.map((item) => item.usdot)).size}</p>
            </div>
            <div className="bg-slate-100 p-4 rounded-lg border dark:bg-transparent">
              <p className="text-sm text-slate-500">Unique Users</p>
              <p className="text-3xl font-bold">{new Set(filteredData.map((item) => item.user)).size}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">View By</CardTitle>
            <CardDescription>Select dimension to analyze</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={filterDimension} onValueChange={(value) => setFilterDimension(value as FilterDimension)}>
              <SelectTrigger>
                <SelectValue placeholder="Select dimension" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usdot">USDOT Number</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="year">Year</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="day">Day</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Filter by User</CardTitle>
            <CardDescription>Select specific user</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user} value={user}>
                    {user === "all" ? "All Users" : user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Filter by USDOT</CardTitle>
            <CardDescription >Select the USDOT number</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedUsdot} onValueChange={setSelectedUsdot}>
              <SelectTrigger>
                <SelectValue placeholder="Select USDOT" />
              </SelectTrigger>
              <SelectContent>
                {usdotNumbers.map((usdot) => (
                  <SelectItem key={usdot} value={usdot}>
                    {usdot === "all" ? "All USDOT Numbers" : usdot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Filter by Year</CardTitle>
            <CardDescription>Select specific year</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedYear} onValueChange={handleYearChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years
                  .sort((a, b) => {
                    if (a === "all") return -1
                    if (b === "all") return 1
                    return Number.parseInt(b) - Number.parseInt(a) // Sort years in descending order
                  })
                  .map((year) => (
                    <SelectItem key={year} value={year}>
                      {year === "all" ? "All Years" : year}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Filter by Month</CardTitle>
            <CardDescription>Select specific month</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedMonth} onValueChange={handleMonthChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month === "all" ? "All Months" : month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Filter by Day</CardTitle>
            <CardDescription>Select specific day</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {availableDays
                  .sort((a, b) => {
                    if (a === "all") return -1
                    if (b === "all") return 1
                    return Number.parseInt(a) - Number.parseInt(b)
                  })
                  .map((day) => (
                    <SelectItem key={day} value={day}>
                      {day === "all" ? "All Days" : `Day ${day}`}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

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
          <CardDescription>
            {selectedUser !== "all" ? `User: ${selectedUser}` : "All users"} |
            {selectedUsdot !== "all" ? ` USDOT: ${selectedUsdot}` : " All USDOT numbers"} |
            {selectedYear !== "all" ? ` Year: ${selectedYear}` : " All years"} |
            {selectedMonth !== "all" ? ` Month: ${selectedMonth}` : " All months"} |
            {selectedDay !== "all" ? ` Day: ${selectedDay}` : " All days"}
          </CardDescription>
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

            {(filterDimension === "day" || filterDimension === "month" || filterDimension === "year") && (
              <TabsContent value="line" className="h-[400px]">
                <LineChartComponent data={chartData} dimension={filterDimension} />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-slate-100 p-4 rounded-lg">
              <p className="text-sm text-slate-500">Total PDF Generations</p>
              <p className="text-3xl font-bold">{filteredData.length}</p>
            </div>
            <div className="bg-slate-100 p-4 rounded-lg">
              <p className="text-sm text-slate-500">Unique USDOT Numbers</p>
              <p className="text-3xl font-bold">{new Set(filteredData.map((item) => item.usdot)).size}</p>
            </div>
            <div className="bg-slate-100 p-4 rounded-lg">
              <p className="text-sm text-slate-500">Unique Users</p>
              <p className="text-3xl font-bold">{new Set(filteredData.map((item) => item.user)).size}</p>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}
