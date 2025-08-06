"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Truck, AlertCircle, Mail, BookCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { User } from "@/lib/types"
import { parseAccessToken } from "@/lib/parse"
import { formatPhoneNumber } from "@/lib/parse"
import axios from "@/axios/axiosInstance"
import parse from 'parse-address';

function parseAddress(address: string) {
  const regex = /^(.*?)\s+([A-Z\s]+),\s*([A-Z]{2})\s+(\d{5})$/i;
  const match = address.match(regex);

  if (!match) return null;

  return {
    street: match[1].trim(),          // "P O BOX 2504"
    city: match[2].trim(),            // "MOBILE"
    state: match[3].toUpperCase(),    // "AL"
    zip: match[4]                     // "36652"
  };
}

export default function NewFiling() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  const [usdotNumber, setUsdotNumber] = useState("")
  const [email, setEmail] = useState("")
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
    setUser(user);
    setIsLoading(false)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!usdotNumber || !email) {
      toast({
        title: "Error",
        description: "Please enter the USDOT number and email address.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Clear form data but keep authentication
    localStorage.removeItem("usdotNumber")
    localStorage.removeItem("carrierEmail")
    localStorage.removeItem("carrierMileage")
    localStorage.removeItem("carrierData")
    localStorage.removeItem("selectedChanges")
    localStorage.removeItem("filingName")
    localStorage.removeItem("employerNumber")

    try {
      // In a real app, this would validate the USDOT number with an API
      // For demo purposes, we'll just simulate a successful validation
      // await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store the USDOT number in localStorage for the next steps
      localStorage.setItem("usdotNumber", usdotNumber)
      localStorage.setItem("carrierEmail", email)

      await axios.get(`/filing/get_by_usdot_number?usdot_number=${usdotNumber}`).then((response) => {
        if (response.status === 200 && response.data) {

          let mailing_address = parse.parseLocation(response.data?.safer_data?.mailing_address)
          if (mailing_address) {
            const parts = [
              mailing_address?.number,
              mailing_address?.prefix,
              mailing_address?.street,
              mailing_address?.type,
              mailing_address?.sec_unit_type,
              mailing_address?.sec_unit_num,
              mailing_address?.suffix
            ];
            mailing_address.street = parts.filter(Boolean).join(' ').toLocaleUpperCase()
            if (mailing_address?.box) {
              mailing_address.street = `P.O. Box ${mailing_address.box}`
            }
          }
          const isSameAddress = (response.data?.data_gov?.carrier_mailing_street || mailing_address?.street || "").trim() === (response.data?.data_gov?.phy_street || response.data?.mobile_fmcsa?.phyStreet || "").trim() &&
            (response.data?.data_gov?.carrier_mailing_city || mailing_address?.city || "").trim() === (response.data?.data_gov?.phy_city || response.data?.mobile_fmcsa?.phyCity || "").trim() &&
            (response.data?.data_gov?.carrier_mailing_state || mailing_address?.state || "").trim() === (response.data?.data_gov?.phy_state || response.data?.mobile_fmcsa?.phyState || "").trim() &&
            (response.data?.data_gov?.carrier_mailing_zip || mailing_address?.zip || "").trim() === (response.data?.data_gov?.phy_zip || response.data?.mobile_fmcsa?.phyZipcode || "").trim()
          console.log(isSameAddress)
          const mockCarrierData = {
            line1: response.data?.safer_data?.legal_name || response.data?.mobile_fmcsa?.legalName || "",
            line2: response.data?.safer_data?.dba_name || response.data?.mobile_fmcsa?.dbaName || "",
            line3_7: {
              line3: response.data?.data_gov?.phy_street || response.data?.mobile_fmcsa?.phyStreet || "",
              line4: response.data?.data_gov?.phy_city || response.data?.mobile_fmcsa?.phyCity || "",
              line5: response.data?.data_gov?.phy_state || response.data?.mobile_fmcsa?.phyState || "",
              line6: response.data?.data_gov?.phy_zip || response.data?.mobile_fmcsa?.phyZipcode || "",
              line7: ""
            },
            line8_12: {
              isSame: isSameAddress,
              line8: response.data?.data_gov?.carrier_mailing_street || mailing_address?.street || "",
              line9: response.data?.data_gov?.carrier_mailing_city || mailing_address?.city || "",
              line10: response.data?.data_gov?.carrier_mailing_state || mailing_address?.state || "",
              line11: response.data?.data_gov?.carrier_mailing_zip || mailing_address?.zip || "",
              line12: ""
            },
            line13_15: {
              line13: formatPhoneNumber(response.data?.data_gov?.phone) || formatPhoneNumber(response?.data?.safer_data?.phone) || "",
              line14: formatPhoneNumber(response.data?.data_gov?.cell_phone) || "",
              line15: formatPhoneNumber(response.data?.data_gov?.fax) || ""
            },
            line16_19: {
              line16: response.data?.safer_data?.usdot || response.data?.mobile_fmcsa?.dotNumber || "",
              line17: "",
              line18: response.data?.safer_data?.duns_number || "",
              line19: response.data?.mobile_fmcsa?.ein || "",
            },
            line22: response.data?.data_gov?.carrier_operation || response.data?.mobile_fmcsa?.carrierOperation?.carrierOperationCode || "",
            line23: response.data?.safer_data?.operation_classification || response.data?.data_gov?.classdef || "",
            line24: response.data?.safer_data?.cargo_carried || "",
            line24_other: response.data?.data_gov?.crgo_cargoothr_desc || "",
            line25: "",
            line26a: {
              owntruck: response.data?.data_gov?.owntruck || "",
              owntract: response.data?.data_gov?.owntract || "",
              owntrail: response.data?.data_gov?.owntrail || "",
              owncoach: response.data?.data_gov?.owncoach || "",
              ownschool_1_8: response.data?.data_gov?.ownschool_1_8 || "",
              ownschool_9_15: response.data?.data_gov?.ownschool_9_15 || "",
              ownschool_16: response.data?.data_gov?.ownschool_16 || "",
              ownbus_16: response.data?.data_gov?.ownbus_16 || "",
              ownvan_1_8: response.data?.data_gov?.ownvan_1_8 || "",
              ownvan_9_15: response.data?.data_gov?.ownvan_9_15 || "",
              ownlimo_1_8: response.data?.data_gov?.ownlimo_1_8 || "",
              ownlimo_9_15: response.data?.data_gov?.ownlimo_9_15 || "",
              ownlimo_16: response.data?.data_gov?.ownlimo_16 || "",

              trmtruck: response.data?.data_gov?.trmtruck || "",
              trmtract: response.data?.data_gov?.trmtract || "",
              trmtrail: response.data?.data_gov?.trmtrail || "",
              trmcoach: response.data?.data_gov?.trmcoach || "",
              trmschool_1_8: response.data?.data_gov?.trmschool_1_8 || "",
              trmschool_9_15: response.data?.data_gov?.trmschool_9_15 || "",
              trmschool_16: response.data?.data_gov?.trmschool_16 || "",
              trmbus_16: response.data?.data_gov?.trmbus_16 || "",
              trmvan_1_8: response.data?.data_gov?.trmvan_1_8 || "",
              trmvan_9_15: response.data?.data_gov?.trmvan_9_15 || "",
              trmlimo_1_8: response.data?.data_gov?.trmlimo_1_8 || "",
              trmlimo_9_15: response.data?.data_gov?.trmlimo_9_15 || "",
              trmlimo_16: response.data?.data_gov?.trmlimo_16 || "",

              trptruck: response.data?.data_gov?.trptruck || "",
              trptract: response.data?.data_gov?.trptract || "",
              trptrail: response.data?.data_gov?.trptrail || "",
              trpcoach: response.data?.data_gov?.trpcoach || "",
              trpschool_1_8: response.data?.data_gov?.trpschool_1_8 || "",
              trpschool_9_15: response.data?.data_gov?.trpschool_9_15 || "",
              trpschool_16: response.data?.data_gov?.trpschool_16 || "",
              trpbus_16: response.data?.data_gov?.trpbus_16 || "",
              trpvan_1_8: response.data?.data_gov?.trpvan_1_8 || "",
              trpvan_9_15: response.data?.data_gov?.trpvan_9_15 || "",
              trplimo_1_8: response.data?.data_gov?.trplimo_1_8 || "",
              trplimo_9_15: response.data?.data_gov?.trplimo_9_15 || "",
              trplimo_16: response.data?.data_gov?.trplimo_16 || "",

              own_haz_truck: "",
              own_haz_trail: "",
              term_haz_truck: "",
              term_haz_trail: "",
              trip_haz_truck: "",
              trip_haz_trail: ""
            },
            line27: {
              interstate_within_100_miles: response.data?.data_gov?.interstate_within_100_miles || "",
              intrastate_within_100_miles: response.data?.data_gov?.intrastate_within_100_miles || "",
              interstate_beyond_100_miles: response.data?.data_gov?.interstate_beyond_100_miles || "",
              intrastate_beyond_100_miles: response.data?.data_gov?.intrastate_beyond_100_miles || "",
              total_drivers: response.data?.data_gov?.total_drivers || response.data?.mobile_fmcsa?.totalDrivers || "",
              total_cdl: response.data?.data_gov?.total_cdl || ""
            }
          }

          // Store the carrier data
          localStorage.setItem("carrierData", JSON.stringify(mockCarrierData))
          if (response.data?.mobile_fmcsa?.ein)
            localStorage.setItem("employerNumber", response.data?.mobile_fmcsa?.ein)
          router.push("/filing/carrier-info")
        }
      }).catch(() => {
        toast({
          title: "Error",
          description: "The USDOT number provided was not found.",
          variant: "destructive",
        })
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate USDOT number. Please try again.",
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
        <Link href="/dashboard" className="inline-flex items-center text-blue-900 hover:text-blue-700">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-blue-900 p-3 rounded-full">
                <Truck className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">New FMCA Filing</CardTitle>
            <CardDescription className="text-center">Step 1: Enter the carrier's USDOT number and email address.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="usdot" className="flex items-center">
                  <BookCheck className="h-4 w-4 mr-2 text-gray-500" />
                  USDOT Number
                </Label>
                <Input
                  id="usdot"
                  type="text"
                  placeholder="Enter USDOT number"
                  value={usdotNumber}
                  onChange={(e) => setUsdotNumber(e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">
                  This will be used to retrieve carrier information and for line 16 on the form.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="carrier@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">This will be used for line 20 on the form.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  The USDOT number will be used to automatically retrieve carrier information from the database.
                </p>
              </div>

              <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                    Validating...
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

