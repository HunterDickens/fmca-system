"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"

// Custom event name for sidebar toggle
const SIDEBAR_TOGGLE_EVENT = "sidebar-toggle"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
  }, [])

  useEffect(() => {
    // Listen for sidebar toggle events
    const handleSidebarToggle = (event: CustomEvent) => {
      setSidebarCollapsed(event.detail.collapsed)
    }

    setHasMounted(true)

    window.addEventListener(SIDEBAR_TOGGLE_EVENT, handleSidebarToggle as EventListener)

    return () => {
      window.removeEventListener(SIDEBAR_TOGGLE_EVENT, handleSidebarToggle as EventListener)
    }
  }, [])

  if (!hasMounted) return null

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <div className="flex min-h-screen flex-col">
        <div className={cn("transition-all duration-300", sidebarCollapsed ? "ml-16" : "ml-64")}>
          <AdminHeader />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
        <AdminSidebar />
      </div>
    </ThemeProvider>
  )
}
