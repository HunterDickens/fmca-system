"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bell, Check, User, FileText, AlertCircle, Clock, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { parseAccessToken } from "@/lib/parse"
import { Notification, NotificationType } from "@/lib/types"
import axios from "@/axios/axiosInstance"


/*
const notifications: Notification[] = [
  {
    id: "1",
    title: "New User Registration",
    description: "John Smith has registered as a new user",
    time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    type: "user",
    link: "/users",
  },
  {
    id: "2",
    title: "PDF Generation Complete",
    description: "USDOT-1234 report has been generated",
    time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    type: "document",
    link: "/reports",
  },
  {
    id: "3",
    title: "System Update",
    description: "System will undergo maintenance in 24 hours",
    time: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: false,
    type: "system",
    link: "/notifications",
  },
  {
    id: "4",
    title: "Login Alert",
    description: "Unusual login detected from new location",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    type: "alert",
    link: "/settings/security",
  },
  {
    id: "5",
    title: "User Role Changed",
    description: "Sarah Johnson has been assigned admin role",
    time: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    read: true,
    type: "user",
    link: "/users",
  },
]
*/

/* interface NotificationsPopoverProps {
  notificationCount: number
  onMarkAllRead: () => void
} */

export function NotificationsPopover() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationCount, setNotificationCount] = useState(0)
  /* const [notifs, setNotifs] = useState<Notification[]>(notifications) */


  const handleMarkAllRead = async () => {
    await axios.get("/notification/mark_all_read").then((response) => {
      if (response.status === 201) {
        setNotificationCount(0)
        setNotifications(notifications.map((n) => ({ ...n, read: true })));
      }
    })
  }
  const markAsRead = async (id: string) => {
    await axios.post("/notification/mark_read", { id }).then((response) => {
      if (response.status === 201) {
        setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
        setNotificationCount(notificationCount => notificationCount - 1)
      }
    })
  }

  const dismiss = async (id: string) => {
    await axios.post("/notification/dismiss", { id }).then((response) => {
      setNotifications(notifications.filter((n) => n.id !== id))
      setNotificationCount(notificationCount => notificationCount - 1)
    })
  }

  const handleViewNotifications = () => {
    const accessToken = localStorage.getItem("accessToken") || '';
    const user = parseAccessToken(accessToken);
    if (user?.isAdmin) {
      router.push("/admin/notifications")
    } else {
      /* toast({
        title: "Login successful",
        description: `Welcome back, ${user?.firstName.trim()}!`,
        variant: "success"
      }) */
    }
  }

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "user":
        return <User className="h-4 w-4 text-blue-500" />
      case "document":
        return <FileText className="h-4 w-4 text-green-500" />
      case "system":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "alert":
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getNotifications = async () => {
    await axios.get("/notification/get").then((response) => {
      if (response.status === 200) {
        setNotifications(response.data.notifications)
        setNotificationCount(response.data.unread_count)
      }
    })
  }

  useEffect(() => {
    getNotifications()

    const interval = setInterval(getNotifications, 10000)
    return () => clearInterval(interval)
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-white hover:bg-blue-900-light hover:text-white">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {notificationCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="font-semibold">Notifications</h3>
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
            <Check className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        </div>
        <ScrollArea className="h-[calc(80vh-10rem)] max-h-96">
          {notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 border-b p-4 transition-colors hover:bg-muted",
                    !notification.read && "bg-muted/50",
                  )}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    {getIcon(notification.type)}
                  </div>
                  <Link
                    href={notification.link}
                    onClick={() => markAsRead(notification.id)}
                    className="flex-1 space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <p className={cn("text-sm font-medium", !notification.read && "font-semibold")}>
                        {notification.title}
                      </p>
                      {!notification.read && <span className="flex h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{notification.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(notification.time, { addSuffix: true })}
                    </p>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => dismiss(notification.id)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Dismiss</span>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-32 flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground">No new notifications</p>
            </div>
          )}
        </ScrollArea>
        <div className="border-t p-2">
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <p onClick={handleViewNotifications}>View all notifications</p>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
