"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { User } from "@/lib/types"
import { parseAccessToken } from "@/lib/parse"

interface ChangeOption {
  id: string
  label: string
}

export default function ChangesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  const [selectedChanges, setSelectedChanges] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const changeOptions: ChangeOption[] = [
    { id: "name", label: "Name (Legal, DBA, or both)" },
    { id: "address", label: "Address (Physical, Mailing, or both)" },
    { id: "phone", label: "Phone Number" },
    { id: "ein", label: "EIN Number" },
    { id: "operations", label: "Company Operations" },
    { id: "classification", label: "Operation Classifications" },
    { id: "cargo", label: "Cargo Classifications" },
    { id: "trucks", label: "Number of Trucks" },
    { id: "drivers", label: "Number of Drivers" },
  ]

  useEffect(() => {
    // Check if user is authenticated
    const accessToken = localStorage.getItem("accessToken") || ''
    const user = parseAccessToken(accessToken);
    if (!user) {
      router.push("/login")
      return
    }

    // Check if we have carrier data
    const storedCarrierData = localStorage.getItem("carrierData")
    if (!storedCarrierData) {
      router.push("/filing/new")
      return
    }

    setUser(user)
    setIsLoading(false)
  }, [router])

  const handleChangeSelection = (id: string) => {
    setSelectedChanges((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const handleSubmit = async () => {
    if (selectedChanges.length === 0) {
      toast({
        title: "No changes selected",
        description: "Please select at least one change to make or go back to the preview.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Store the selected changes
      localStorage.setItem("selectedChanges", JSON.stringify(selectedChanges))

      // In a real app, this would navigate to specific change forms based on selection
      // For demo purposes, we'll just simulate processing and go to the next step
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Navigate to the first change form or a change hub page
      router.push("/filing/edit-changes")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your selection. Please try again.",
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
        <Link href="/filing/form-preview" className="inline-flex items-center text-blue-900 hover:text-blue-700">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Form Preview
        </Link>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Make Changes</CardTitle>
                  <CardDescription>Select the information you need to change</CardDescription>
                </div>
                <Edit className="h-8 w-8 text-blue-900" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  {changeOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={selectedChanges.includes(option.id)}
                        onCheckedChange={() => handleChangeSelection(option.id)}
                      />
                      <Label htmlFor={option.id} className="cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex flex-col space-y-4">
                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-blue-900 hover:bg-blue-800"
                    disabled={isSubmitting || selectedChanges.length === 0}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Save className="mr-2 h-5 w-5" />
                        Continue
                      </span>
                    )}
                  </Button>

                  <Button variant="outline" asChild>
                    <Link href="/filing/form-preview">Cancel</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          &copy; 2025 FMCA Filings Generator. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

