"use client"

import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "@/components/profile-form"
import Header from "@/app/header"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-4">
        <Link href="/dashboard" className="inline-flex items-center text-blue-900 hover:text-blue-700">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8 space-y-4">
        <div>
          <h1 className="text-2xl font-medium">Profile</h1>
          <p className="text-sm text-muted-foreground">
            Update your personal information and reset your password here.
          </p>
        </div>
        <Separator />
        <ProfileForm />
      </main>
    </div>
  )
}
