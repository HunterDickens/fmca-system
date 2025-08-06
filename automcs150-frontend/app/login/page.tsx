"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff } from "lucide-react"
import { parseAccessToken } from "@/lib/parse"
import axios from '@/axios/axiosInstance'
import Cookies from 'universal-cookie'
import { useTheme } from "next-themes"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const cookies = new Cookies()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real application, this would be an API call to authenticate
      // For demo purposes, we'll just simulate a successful login
      // await new Promise((resolve) => setTimeout(resolve, 1000))
      if (email && password) {
        const response = await axios.post('/auth/login', {
          email: email,
          password: password
        });
        if (response.status === 200) {
          cookies.set("accesstoken", "", { path: '' })
          localStorage.setItem("accessToken", response?.data?.accessToken)
          cookies.set("accesstoken", response?.data?.accessToken, { path: '' })
          const user = parseAccessToken(response?.data?.accessToken);
          if (user?.isAdmin) router.push("/admin/dashboard")
          else router.push("/get-started")
          toast({
            title: "Login successful",
            description: `Welcome back, ${user?.firstName.trim()}!`,
            variant: "success"
          })
        }
      } else {
        throw new Error("Please enter both email and password")
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'There is a connection error with the server.'
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-blue-900 flex flex-col bg-[url('/bg-login.jpg')] bg-cover bg-center">
      {/* <div className="container mx-auto px-4 py-4">
        <Link href="/" className="inline-flex items-center text-white font-bold">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div> */}

      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-900 p-3 rounded-full">
                <Truck className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Employee Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the FMCA Filings Generator
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    className="border-gray-300 focus:border-[#1e3a8a] focus:ring-[#1e3a8a] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Need your account?{" "}
              <Link href="/register" className="text-blue-900 hover:underline">
                Sign up here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

