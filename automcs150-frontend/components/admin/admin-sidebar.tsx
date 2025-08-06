"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, ChevronLeft, ChevronRight, FileText, Bell, Home, Truck, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Create a custom event for sidebar state changes
const SIDEBAR_TOGGLE_EVENT = "sidebar-toggle"

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: Home,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "PDF Statistics",
      href: "/admin/statistics",
      icon: FileText,
    },
    {
      title: "Notifications",
      href: "/admin/notifications",
      icon: Bell,
    },
    {
      title: "Filings Generator",
      href: "/get-started",
      icon: Truck,
    },
  ]

  const toggleSidebar = () => {
    const newState = !collapsed
    setCollapsed(newState)

    // Dispatch custom event when sidebar state changes
    const event = new CustomEvent(SIDEBAR_TOGGLE_EVENT, { detail: { collapsed: newState } })
    window.dispatchEvent(event)
  }

  return (
    <div
      className={cn(
        "fixed top-0 left-0 z-20 flex h-screen flex-col border-r bg-blue-900 text-white transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-14 items-center border-b text-white px-3">
        <Link
          href="/admin/dashboard"
          className={cn("flex items-center gap-2 font-bold text-white", collapsed ? "justify-center" : "px-2")}
        >
          <Truck className="h-6 w-6" />
          {!collapsed && <span>FMCA Admin</span>}
        </Link>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-16 z-10 h-6 w-6 rounded-full border bg-background text-fmca-blue dark:text-white"
        onClick={toggleSidebar}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-blue-900-light",
                pathname === item.href ? "bg-blue-900-light font-medium" : "text-white/80",
                collapsed ? "justify-center" : "",
              )}
            >
              <item.icon className="h-4 w-4" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-fmca-blue-light p-4">
        <div
          className={cn("flex items-center gap-3 rounded-lg bg-blue-900-light p-3", collapsed ? "justify-center" : "")}
        >
          <Truck className="h-4 w-4 text-white" />
          {!collapsed && (
            <div className="space-y-1">
              <p className="text-[11px] font-medium leading-none">&copy; 2025 FMCA Filings Generator.</p>
              <p className="text-[13px] text-white/80">All rights reserved.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
