"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowRight, FileText, LogOut, Shield, Truck } from "lucide-react"
import { parseAccessToken } from "@/lib/parse"
import { User } from "@/lib/types";
import Cookies from 'universal-cookie'
import { useTheme } from "next-themes"

export default function Home() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState<User | null>(null);
  const cookies = new Cookies()

  const handleLogout = () => {
    cookies.remove("accesstoken", { path: '' })
    setTheme("light")
    localStorage.clear()
    router.push("/login")
  }

  useEffect(() => {
    // Check if user is authenticated
    const accessToken = localStorage.getItem("accessToken") || '';
    const user = parseAccessToken(accessToken);
    if (!user) {
      router.push("/login");
      return;
    }
    setTheme("light")
    setUser(user);
  }, [router])

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-900 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Truck className="h-6 w-6" />
            <h1 className="text-xl font-bold">FMCA Filings Generator</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Button variant="ghost" className="text-white hover:font-bold" onClick={handleLogout}>
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20" >
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">FMCA Filings PDF Generator</h2>
              <p className="text-xl mb-6">
                Streamline your Federal Motor Carrier Authority filings with our automated PDF generator. Save time and
                ensure compliance with ease.
              </p>
              <div className="flex space-x-4">
                <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
                  <Link href="/dashboard">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <FileText className="h-24 w-24 text-blue-900 mx-auto mb-4" />
                <h3 className="text-blue-900 text-xl font-bold text-center mb-2">Automated FMCA Form Generation</h3>
                <p className="text-gray-700 text-center">
                  Generate accurate FMCA forms with just a few clicks. Our system automatically retrieves carrier
                  information based on USDOT numbers.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-blue-900 font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Enter USDOT Number</h3>
                <p className="text-gray-600">
                  Start by entering the carrier's USDOT number. Our system will automatically retrieve the available
                  information.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-blue-900 font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Complete Required Fields</h3>
                <p className="text-gray-600">
                  Fill in any additional required information and verify the pre-populated data for accuracy.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-blue-900 font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Generate & Download PDF</h3>
                <p className="text-gray-600">
                  With a single click, generate a properly formatted FMCA filing PDF ready for submission.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <Shield className="h-16 w-16 text-blue-900 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Secure & Employee-Only Access</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our system is designed for authorized employees only, ensuring your data remains secure and compliant.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2025 FMCA Filings Generator. All rights reserved.</p>
            </div>
            <div>
              <ul className="flex space-x-6">
                <li>
                  <Link href="#" className="hover:underline">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

