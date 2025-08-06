"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { LogOut, Settings, Truck, User, Sun, Moon } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationsPopover } from "@/components/notifications-popover"
import { useRouter } from "next/navigation"
import Cookies from 'universal-cookie'

export function AdminHeader() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [notificationCount, setNotificationCount] = useState(3)
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const cookies = new Cookies()

  const handleLogout = () => {
    cookies.remove("accesstoken", { path: '' })
    setTheme("light")
    localStorage.clear()
    router.push("/login")
  }
  const handleProfile = () => {
    router.push("/admin/profile")
  }
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-blue-900 px-4 md:px-6 w-full">
      <div className="mr-4 flex items-center md:hidden">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-white">
          <Truck className="h-5 w-5" />
          <span className="text-sm">FMCA</span>
        </Link>
      </div>
      <div className="hidden items-center gap-2 md:flex">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-white">
          <Truck className="h-6 w-6" />
          <span className="text-xl">FMCA Filings Generator</span>
        </Link>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 text-white">
          <Sun className="h-4 w-4" />
          <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} aria-label="Toggle theme" />
          <Moon className="h-4 w-4" />
        </div>
        <NotificationsPopover />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full border border-white/20 bg-blue-900-light h-8 w-8 text-white hover:bg-blue-900-light/80"
            >
              <User className="h-4 w-4" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfile}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
