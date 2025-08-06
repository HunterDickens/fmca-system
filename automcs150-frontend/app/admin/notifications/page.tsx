"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { User, FileText, AlertCircle, Clock, MoreHorizontal, Check, Trash2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Notification, NotificationType } from "@/lib/types"
import axios from "@/axios/axiosInstance"

/*
const initialNotifications: Notification[] = [
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
    {
        id: "6",
        title: "PDF Generation Failed",
        description: "USDOT-5678 report generation failed",
        time: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
        read: true,
        type: "document",
        link: "/reports",
    },
    {
        id: "7",
        title: "System Performance Alert",
        description: "System experiencing high load",
        time: new Date(Date.now() - 1000 * 60 * 60 * 96), // 4 days ago
        read: true,
        type: "alert",
        link: "/dashboard",
    },
    {
        id: "8",
        title: "Feature Update",
        description: "New reporting features have been added",
        time: new Date(Date.now() - 1000 * 60 * 60 * 120), // 5 days ago
        read: true,
        type: "system",
        link: "/dashboard",
    },
] */

export default function NotificationsList() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [notificationCount, setNotificationCount] = useState(0)
    const [activeTab, setActiveTab] = useState<NotificationType>("all")

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case "user":
                return <User className="h-5 w-5 text-blue-500" />
            case "document":
                return <FileText className="h-5 w-5 text-green-500" />
            case "system":
                return <Clock className="h-5 w-5 text-amber-500" />
            case "alert":
                return <AlertCircle className="h-5 w-5 text-red-500" />
            default:
                return <Clock className="h-5 w-5" />
        }
    }

    /* const markAsRead = (id: string) => {
        setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
    } */
    const markAsRead = async (id: string) => {
        await axios.post("/notification/mark_read", { id }).then((response) => {
            if (response.status === 201) {
                setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
                setNotificationCount(notificationCount => notificationCount - 1)
            }
        })
    }

    const markAllAsRead = async () => {
        await axios.get("/notification/mark_all_read").then((response) => {
            if (response.status === 201) {
                setNotifications(notifications.map((n) => ({ ...n, read: true })))
            }
        })
    }
    const clearAll = async () => {
        await axios.get("/notification/dismiss_all").then((response) => {
            if (response.status === 201) {
                getNotifications()
            }
        })
    }

    const deleteNotification = async (id: string) => {
        await axios.post("/notification/dismiss", { id }).then((response) => {
            setNotifications(notifications.filter((n) => n.id !== id))
            setNotificationCount(notificationCount => notificationCount - 1)
        })
    }

    const filteredNotifications = activeTab === "all" ? notifications : notifications.filter((n) => n.type === activeTab)

    const unreadCount = notifications.filter((n) => !n.read).length
    const userCount = notifications.filter((n) => n.type === "user").length
    const documentCount = notifications.filter((n) => n.type === "document").length
    const systemCount = notifications.filter((n) => n.type === "system").length
    const alertCount = notifications.filter((n) => n.type === "alert").length

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
    }, [activeTab])

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>All Notifications</CardTitle>
                    <CardDescription>You have {unreadCount} unread notifications</CardDescription>
                </div>
                <div className="space-x-4">
                    <Button variant="outline" size="sm" onClick={markAllAsRead}>
                        <Check className="mr-2 h-4 w-4" />
                        Mark all as read
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearAll}>
                        <Check className="mr-2 h-4 w-4" />
                        Clear all as read
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value as NotificationType)}>
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                        <TabsTrigger value="all" className="relative">
                            All
                            {unreadCount > 0 && (
                                <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">{unreadCount}</Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="user" className="relative">
                            Users
                            {notifications.filter((n) => n.type === "user" && !n.read).length > 0 && (
                                <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                                    {notifications.filter((n) => n.type === "user" && !n.read).length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="document" className="relative">
                            Documents
                            {notifications.filter((n) => n.type === "document" && !n.read).length > 0 && (
                                <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                                    {notifications.filter((n) => n.type === "document" && !n.read).length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="system" className="relative">
                            System
                            {notifications.filter((n) => n.type === "system" && !n.read).length > 0 && (
                                <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                                    {notifications.filter((n) => n.type === "system" && !n.read).length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="alert" className="relative">
                            Alerts
                            {notifications.filter((n) => n.type === "alert" && !n.read).length > 0 && (
                                <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                                    {notifications.filter((n) => n.type === "alert" && !n.read).length}
                                </Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="mt-4">
                        {renderNotificationList(filteredNotifications)}
                    </TabsContent>
                    <TabsContent value="user" className="mt-4">
                        {renderNotificationList(filteredNotifications)}
                    </TabsContent>
                    <TabsContent value="document" className="mt-4">
                        {renderNotificationList(filteredNotifications)}
                    </TabsContent>
                    <TabsContent value="system" className="mt-4">
                        {renderNotificationList(filteredNotifications)}
                    </TabsContent>
                    <TabsContent value="alert" className="mt-4">
                        {renderNotificationList(filteredNotifications)}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )

    function renderNotificationList(notifications: Notification[]) {
        if (notifications.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground">No notifications found</p>
                </div>
            )
        }

        return (
            <div className="space-y-4">
                {notifications.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).map((notification) => (
                    <div
                        key={notification.id}
                        className={cn(
                            "flex items-start gap-4 rounded-lg border p-4 transition-colors",
                            !notification.read && "bg-muted/50",
                        )}
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                            {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <p className={cn("font-medium", !notification.read && "font-semibold")}>{notification.title}</p>
                                {!notification.read && <span className="flex h-2 w-2 rounded-full bg-primary" />}
                            </div>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                            <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(notification.time, { addSuffix: true })}
                            </p>
                        </div>
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Actions</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {!notification.read && (
                                        <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                            <Check className="mr-2 h-4 w-4" />
                                            Mark as read
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => deleteNotification(notification.id)}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
}
