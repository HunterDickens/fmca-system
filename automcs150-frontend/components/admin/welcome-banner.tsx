"use client"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface WelcomeBannerProps {
  onDismiss: () => void
}

export function WelcomeBanner({ onDismiss }: WelcomeBannerProps) {
  return (
    <Card className="bg-gradient-to-r from-blue-900 to-blue-600 text-white overflow-hidden">
      <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Welcome to FMCA Filings Admin Dashboard</h2>
          <p className="text-blue-50">
            Manage users, track PDF generation statistics, and monitor system performance all in one place.
          </p>
        </div>
        <div className="flex gap-4">
          {/* <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
            View Tutorial
          </Button> */}
          <Button variant="ghost" size="icon" onClick={onDismiss} className="text-white hover:bg-blue-900 hover:text-white">
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
