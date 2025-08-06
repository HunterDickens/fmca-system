"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, TrendingUp, BookCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { User } from "@/lib/types"
import { parseAccessToken } from "@/lib/parse"

export default function CarrierInfo() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  const [usdotNumber, setUsdotNumber] = useState("")
  const [mileage, setMileage] = useState("")
  const [employerNumber, setEmploerNumber] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is authenticated
    const accessToken = localStorage.getItem("accessToken") || ''
    const user = parseAccessToken(accessToken);
    if (!user) {
      router.push("/login")
      return
    }

    // Get USDOT number from previous step
    const storedUsdot = localStorage.getItem("usdotNumber")
    const storedEmployerNumber = localStorage.getItem("employerNumber");
    if (!storedUsdot) {
      router.push("/filing/new")
      return
    }

    setUsdotNumber(storedUsdot)
    setEmploerNumber(storedEmployerNumber || "")
    setUser(user)
    setIsLoading(false)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!employerNumber || !mileage) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Store the carrier info in localStorage for the next steps

      localStorage.setItem("carrierMileage", mileage)
      localStorage.setItem("employerNumber", employerNumber)

      // In a real app, this would fetch carrier data from an API
      // For demo purposes, we'll simulate fetching carrier data

      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push("/filing/form-preview")

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process carrier information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
      <header className="bg-blue-900 text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-bold">FMCA Filings Generator</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        <Link href="/filing/new" className="inline-flex items-center text-blue-900 hover:text-blue-700">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to USDOT Entry
        </Link>
      </div>

      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4 space-x-4">
              <div className="bg-gray-300 text-white font-bold w-[50px] h-[50px] rounded-full flex items-center justify-center">
                <span className="text-white font-bold">1</span>
              </div>
              <div className="bg-blue-900 text-white font-bold w-[50px] h-[50px] rounded-full flex items-center justify-center">
                <span className="text-white font-bold">2</span>
              </div>
              <div className="bg-gray-300 text-white font-bold w-[50px] h-[50px] rounded-full flex items-center justify-center">
                <span className="text-white font-bold">3</span>
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Carrier Information</CardTitle>
            <CardDescription className="text-center">
              Step 2: Enter carrier mileage and EIN information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-gray-100 rounded-lg mb-4">
                <p className="text-sm font-medium">
                  USDOT Number: <span className="font-bold">{usdotNumber}</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mileage" className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-gray-500" />
                  Carrier Mileage for 2024
                </Label>
                <Input
                  id="mileage"
                  type="text"
                  placeholder="Enter mileage"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">This will be used for line 21 on the form.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mileage" className="flex items-center">
                  <BookCheck className="h-4 w-4 mr-2 text-gray-500" />
                  Employer Identification Number
                </Label>
                <Input
                  id="mileage"
                  type="text"
                  placeholder="Enter EIN"
                  value={employerNumber}
                  onChange={(e) => setEmploerNumber(e.target.value)}
                  required
                  disabled={employerNumber.length > 0 ? true : false}
                />
                <p className="text-sm text-gray-500">This will be used for line 19 on the form.</p>
              </div>

              <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          &copy; 2025 FMCA Filings Generator. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

