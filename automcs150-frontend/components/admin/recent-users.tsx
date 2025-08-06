import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import axios from "@/axios/axiosInstance"
import moment from "moment"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  isAdmin: boolean
  createdAt: string
  lastLogin: string
  status: number
}

export function RecentUsers() {
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      lastLogin: "2 hours ago",
      role: "Admin",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      lastLogin: "1 day ago",
      role: "User",
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      lastLogin: "3 days ago",
      role: "User",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@example.com",
      lastLogin: "1 week ago",
      role: "User",
    },
  ]

  const [recentUsers, setRecentUsers] = useState<User[]>([]);

  const fetchRecentUsers = async () => {
    await axios.get("/dashboard/get_recent_users").then((response) => {
      if (response.status === 200) {
        setRecentUsers(response.data.recentUsers)
      }
    }).finally(() => {

    })
  }

  useEffect(() => {
    fetchRecentUsers()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
        <CardDescription>Recently active users on the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback className="bg-blue-900 text-white">
                  {`${user.firstName[0]}${user.lastName[0]}`}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{`${user.firstName} ${user.lastName}`}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <div className="text-xs text-right">
                <p className="font-medium">{user.isAdmin ? "Admin" : "User"}</p>
                <p className="text-muted-foreground">{moment.utc(user.lastLogin).fromNow()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
