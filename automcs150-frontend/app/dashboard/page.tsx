"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Plus, ClipboardList, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { parseAccessToken } from "@/lib/parse"
import { User } from "@/lib/types";
import Header from "@/app/header"
import { useTheme } from "next-themes"

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is authenticated
    const accessToken = localStorage.getItem("accessToken") || '';
    const user = parseAccessToken(accessToken);
    setIsLoading(false)
    if (!user) {
      router.push("/login");
      return;
    }
    setTheme("light")
    setUser(user);
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back, {user.firstName.trim()}!</h2>
          <p className="text-gray-600">Generate and manage FMCA filings for your carriers.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Create New Filing</CardTitle>
              <CardDescription>Generate a new FMCA filing for a carrier</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-blue-900 hover:bg-blue-800">
                <Link href="/filing/new">
                  <Plus className="mr-2 h-5 w-5" />
                  New Filing
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Recent Filings</CardTitle>
              <CardDescription>View and manage your recent FMCA filings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/filing/history">
                  <ClipboardList className="mr-2 h-5 w-5" />
                  View History
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-blue-900" />
            </div>
            <div>
              <h3 className="font-medium text-lg text-gray-800">Quick Guide</h3>
              <p className="text-gray-600 mt-1">
                To create a new filing, click on "New Filing" and follow these steps:
              </p>
              <ol className="mt-2 space-y-1 text-gray-600 list-decimal list-inside">
                <li>Enter the carrier's USDOT number</li>
                <li>Provide the carrier's email and mileage information</li>
                <li>Review the pre-populated information</li>
                <li>Make any necessary changes</li>
                <li>Generate and download the PDF</li>
              </ol>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          &copy; 2025 FMCA Filings Generator. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

