"use client"

import { useState, useEffect } from "react"
import { Users, FileText, ArrowUpRight, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import axios from "@/axios/axiosInstance"

export function DashboardCards() {
  const { toast } = useToast()
  const [animatedStats, setAnimatedStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pdfGenerated: 0,
  })

  const [targetStats, setTargetStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pdfGenerated: 0
  })

  useEffect(() => {
    const duration = 1000 // 1 second for the animation
    const frameRate = 60
    const totalFrames = (duration / 1000) * frameRate
    let frame = 0

    const timer = setInterval(() => {
      frame++
      const progress = frame / totalFrames

      if (frame <= totalFrames) {
        setAnimatedStats({
          totalUsers: Math.floor(targetStats.totalUsers * progress),
          activeUsers: Math.floor(targetStats.activeUsers * progress),
          pdfGenerated: Math.floor(targetStats.pdfGenerated * progress)
        })
      } else {
        clearInterval(timer)
        setAnimatedStats(targetStats)
      }
    }, 1000 / frameRate)

    return () => clearInterval(timer)
  }, [targetStats])

  const getStatistics = async () => {
    await axios.get("/dashboard/get_stats").then((response) => {
      if (response.status === 200) {
        setTargetStats({
          activeUsers: response.data.activeUsers,
          totalUsers: response.data.totalUsers,
          pdfGenerated: response.data.pdfGenerated
        })
      }
    }).catch(() => {
    }).finally(() => {
    })
  }
  useEffect(() => {
    getStatistics()
  }, [])

  const stats = [
    {
      title: "Total Users",
      value: animatedStats.totalUsers.toLocaleString(),
      description: "+0% from last month",
      icon: Users,
      trend: "up",
      color: "blue",
    },
    {
      title: "Active Users",
      value: animatedStats.activeUsers.toLocaleString(),
      description: "+0% from last month",
      icon: Users,
      trend: "up",
      color: "green",
    },
    {
      title: "PDF Generated",
      value: animatedStats.pdfGenerated.toLocaleString(),
      description: "+0% from last month",
      icon: FileText,
      trend: "up",
      color: "amber",
    }
  ]

  return (
    <>
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={cn(
            "overflow-hidden transition-all duration-300 hover:shadow-md",
            "border-t-4",
            stat.color === "blue" && "border-t-blue-500",
            stat.color === "green" && "border-t-green-500",
            stat.color === "amber" && "border-t-amber-500",
            stat.color === "purple" && "border-t-purple-500",
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div
              className={cn(
                "rounded-full p-2",
                stat.color === "blue" && "bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300",
                stat.color === "green" && "bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300",
                stat.color === "amber" && "bg-amber-100 text-amber-500 dark:bg-amber-900 dark:text-amber-300",
                stat.color === "purple" && "bg-purple-100 text-purple-500 dark:bg-purple-900 dark:text-purple-300",
              )}
            >
              <stat.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {stat.trend === "up" && <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />}
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
