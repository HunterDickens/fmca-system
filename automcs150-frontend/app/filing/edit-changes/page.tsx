"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Check, X, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { User } from "@/lib/types";
import { parseAccessToken } from "@/lib/parse"

interface CarrierData {
  line1: string
  line2: string
  line3_7: {
    line3: string
    line4: string
    line5: string
    line6: string
    line7: string
  }
  line8_12: {
    isSame: boolean
    line8: string
    line9: string
    line10: string
    line11: string
    line12: ""
  }
  line13_15: {
    line13: string
    line14: string
    line15: string
  }
  line16_19: {
    line16: string
    line17: string
    line18: string
    line19: string
  }
  line22: string
  line23: Array<string>
  line24: Array<string>
  line24_other: string
  line25: string
  line26a: {
    owntruck: string
    owntract: string
    owntrail: string
    owncoach: string
    ownschool_1_8: string
    ownschool_9_15: string
    ownschool_16: string
    ownbus_16: string
    ownvan_1_8: string
    ownvan_9_15: string
    ownlimo_1_8: string
    ownlimo_9_15: string
    ownlimo_16: string

    trmtruck: string
    trmtract: string
    trmtrail: string
    trmcoach: string
    trmschool_1_8: string
    trmschool_9_15: string
    trmschool_16: string
    trmbus_16: string
    trmvan_1_8: string
    trmvan_9_15: string
    trmlimo_1_8: string
    trmlimo_9_15: string
    trmlimo_16: string

    trptruck: string
    trptract: string
    trptrail: string
    trpcoach: string
    trpschool_1_8: string
    trpschool_9_15: string
    trpschool_16: string
    trpbus_16: string
    trpvan_1_8: string
    trpvan_9_15: string
    trplimo_1_8: string
    trplimo_9_15: string
    trplimo_16: string

    own_haz_truck: string
    own_haz_trail: string
    term_haz_truck: string
    term_haz_trail: string
    trip_haz_truck: string
    trip_haz_trail: string
  }
  line27: {
    interstate_within_100_miles: string
    intrastate_within_100_miles: string
    interstate_beyond_100_miles: string
    intrastate_beyond_100_miles: string
    total_drivers: string
    total_cdl: string
  }
}

export default function EditChanges() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  const [selectedChanges, setSelectedChanges] = useState<string[]>([])
  const [carrierData, setCarrierData] = useState<CarrierData | null>(null)
  const [employerNumber, setEmployerNumber] = useState("")
  const [formData, setFormData] = useState<Partial<CarrierData>>({})
  const [activeTab, setActiveTab] = useState("name")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [moreChanges, setMoreChanges] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is authenticated
    const accessToken = localStorage.getItem("accessToken") || '';
    const user = parseAccessToken(accessToken);
    if (!user) {
      router.push("/login");
      return;
    }

    // Get selected changes and carrier data
    const storedChanges = localStorage.getItem("selectedChanges")
    const storedCarrierData = localStorage.getItem("carrierData")
    const storedEmployerNumber = localStorage.getItem("employerNumber")

    if (!storedChanges || !storedCarrierData || !storedEmployerNumber) {
      router.push("/filing/changes")
      return
    }

    const parsedChanges = JSON.parse(storedChanges)
    const parsedCarrierData = JSON.parse(storedCarrierData)

    setSelectedChanges(parsedChanges)
    setCarrierData(parsedCarrierData)
    setEmployerNumber(storedEmployerNumber)
    setFormData(parsedCarrierData)

    // Set the active tab to the first selected change
    if (parsedChanges.length > 0) {
      setActiveTab(parsedChanges[0])
    }

    setUser(user);
    setIsLoading(false)
  }, [router])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNestedInputChange = (
    parent: keyof CarrierData,
    field: string,
    value: any
  ) => {
    setFormData((prev) => {
      const nested = prev[parent] ?? {} // fallback to empty object
      return {
        ...prev,
        [parent]: {
          ...(nested as Record<string, any>),
          [field]: value,
        },
      }
    })
  }

  const handleNext = () => {
    const currentIndex = selectedChanges.indexOf(activeTab)
    if (currentIndex < selectedChanges.length - 1)
      setActiveTab(selectedChanges[currentIndex + 1])
  }

  const handlePrev = () => {
    const currentIndex = selectedChanges.indexOf(activeTab)
    if (currentIndex > 0)
      setActiveTab(selectedChanges[currentIndex - 1])
  }


  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // In a real app, this would update the carrier data in the database
      // For demo purposes, we'll just update the local storage

      const updatedCarrierData = {
        ...carrierData,
        ...formData,
        ...formData.line8_12?.isSame && {
          line8_12: {
            isSame: true,
            line8: formData.line3_7?.line3,
            line9: formData.line3_7?.line4,
            line10: formData.line3_7?.line5,
            line11: formData.line3_7?.line6
          }
        }
      }

      localStorage.setItem("carrierData", JSON.stringify(updatedCarrierData))

      toast({
        title: "Changes Saved",
        description: "Your changes have been saved successfully.",
        variant: "info"
      })

      if (moreChanges) {
        // Go back to the changes selection page
        router.push("/filing/changes")
      } else {
        // Go back to the form preview
        router.push("/filing/form-preview")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
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

  if (!user || !carrierData) {
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
        <Link href="/filing/changes" className="inline-flex items-center text-blue-900 hover:text-blue-700">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Changes Selection
        </Link>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Edit Information</CardTitle>
              <CardDescription>Make changes to the selected information</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-6 h-full">
                  {selectedChanges.includes("name") && <TabsTrigger value="name">Name</TabsTrigger>}
                  {selectedChanges.includes("address") && <TabsTrigger value="address">Address</TabsTrigger>}
                  {selectedChanges.includes("phone") && <TabsTrigger value="phone">Phone</TabsTrigger>}
                  {selectedChanges.includes("ein") && <TabsTrigger value="ein">EIN</TabsTrigger>}
                  {selectedChanges.includes("operations") && <TabsTrigger value="operations">Company Operations</TabsTrigger>}
                  {selectedChanges.includes("classification") && (
                    <TabsTrigger value="classification">Classification</TabsTrigger>
                  )}
                  {selectedChanges.includes("cargo") && <TabsTrigger value="cargo">Cargo</TabsTrigger>}
                  {selectedChanges.includes("trucks") && <TabsTrigger value="trucks">Trucks</TabsTrigger>}
                  {selectedChanges.includes("drivers") && <TabsTrigger value="drivers">Drivers</TabsTrigger>}
                </TabsList>

                {selectedChanges.includes("name") && (
                  <TabsContent value="name" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="legalName">Legal Name</Label>
                      <Input
                        id="legalName"
                        value={formData.line1}
                        onChange={(e) => handleInputChange("line1", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dba">DBA (Doing Business As)</Label>
                      <Input
                        id="dba"
                        value={formData.line2 || ""}
                        onChange={(e) => handleInputChange("line2", e.target.value)}
                      />
                    </div>
                  </TabsContent>
                )}

                {selectedChanges.includes("address") && (
                  <TabsContent value="address" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">PRINCIPAL PLACE OF BUSINESS</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="physicalStreet">Street Address/Route Number</Label>
                          <Input
                            id="physicalStreet"
                            value={formData.line3_7?.line3}
                            onChange={(e) => handleNestedInputChange("line3_7", "line3", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="physicalCity">City</Label>
                          <Input
                            id="physicalCity"
                            value={formData.line3_7?.line4}
                            onChange={(e) => handleNestedInputChange("line3_7", "line4", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="physicalState">State/Province</Label>
                          <Input
                            id="physicalState"
                            value={formData.line3_7?.line5}
                            onChange={(e) => handleNestedInputChange("line3_7", "line5", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="physicalZip">ZIP Code</Label>
                          <Input
                            id="physicalZip"
                            value={formData.line3_7?.line6}
                            onChange={(e) => handleNestedInputChange("line3_7", "line6", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <div className="flex items-center space-x-2 mb-4">
                        <Checkbox
                          id="sameAsPhysical"
                          checked={formData.line8_12?.isSame}
                          onCheckedChange={(checked) => {
                            handleNestedInputChange("line8_12", "isSame", checked)
                          }}
                        />
                        <Label htmlFor="sameAsPhysical">Mailing address is the same as physical address</Label>
                      </div>

                      {!(formData.line8_12?.isSame) && (
                        <div>
                          <h3 className="text-lg font-medium mb-3">MAILING ADDRESS</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="mailingStreet">Street Address/Route Number</Label>
                              <Input
                                id="mailingStreet"
                                value={formData.line8_12?.line8}
                                onChange={(e) => handleNestedInputChange("line8_12", "line8", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="mailingCity">City</Label>
                              <Input
                                id="mailingCity"
                                value={formData.line8_12?.line9}
                                onChange={(e) => handleNestedInputChange("line8_12", "line9", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="mailingState">State/Province</Label>
                              <Input
                                id="mailingState"
                                value={formData.line8_12?.line10}
                                onChange={(e) => handleNestedInputChange("line8_12", "line10", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="mailingZip">ZIP Code</Label>
                              <Input
                                id="mailingZip"
                                value={formData.line8_12?.line11}
                                onChange={(e) => handleNestedInputChange("line8_12", "line11", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )}

                {selectedChanges.includes("phone") && (
                  <TabsContent value="phone" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessPhoneNumber">13. PRINCIPAL BUSINESS PHONE NUMBER</Label>
                      <Input
                        id="businessPhoneNumber"
                        value={formData.line13_15?.line13}
                        onChange={(e) => handleNestedInputChange("line13_15", "line13", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cellPhoneNumber">14. PRINCIPAL CONTACT CELL PHONE NUMBER</Label>
                      <Input
                        id="cellPhoneNumber"
                        value={formData.line13_15?.line14}
                        onChange={(e) => handleNestedInputChange("line13_15", "line14", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessFaxNumber">15. PRINCIPAL BUSINESS FAX NUMBER</Label>
                      <Input
                        id="businessFaxNumber"
                        value={formData.line13_15?.line15}
                        onChange={(e) => handleNestedInputChange("line13_15", "line15", e.target.value)}
                      />
                    </div>
                  </TabsContent>
                )}

                {selectedChanges.includes("ein") && (
                  <TabsContent value="ein" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ein">EIN Number</Label>
                      <Input
                        id="ein"
                        value={employerNumber}
                        onChange={(e) => {
                          setEmployerNumber(e.target.value)
                          localStorage.setItem("employerNumber", e.target.value)
                        }}
                      />
                      {/* <p className="text-sm text-gray-500">Format: XX-XXXXXXX</p> */}
                    </div>
                  </TabsContent>
                )}

                {selectedChanges.includes("operations") && (
                  <TabsContent value="operations" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="operations">COMPANY OPERATIONS</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="flex items-start gap-2">
                          <Checkbox id="op-a" checked={formData.line22 === 'A'} onCheckedChange={(checked) => {
                            if (checked) {
                              handleInputChange("line22", "A");
                            } else {
                              handleInputChange("line22", ""); // Optional: unset if unchecked
                            }
                          }} />
                          <label htmlFor="op-a" className="text-sm leading-tight whitespace-nowrap">
                            A. Interstate Carrier
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="op-b" checked={formData.line22 === 'B'} onCheckedChange={(checked) => {
                            if (checked) {
                              handleInputChange("line22", "B");
                            } else {
                              handleInputChange("line22", ""); // Optional: unset if unchecked
                            }
                          }} />
                          <label htmlFor="op-b" className="text-sm leading-tight whitespace-nowrap">
                            B. Intrastate Hazmat Carrier
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="op-c" checked={formData.line22 === 'C'} onCheckedChange={(checked) => {
                            if (checked) {
                              handleInputChange("line22", "C");
                            } else {
                              handleInputChange("line22", ""); // Optional: unset if unchecked
                            }
                          }} />
                          <label htmlFor="op-c" className="text-sm leading-tight whitespace-nowrap">
                            C. Intrastate Non-Hazmat Carrier
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="op-d" checked={formData.line22 === 'D'} onCheckedChange={(checked) => {
                            if (checked) {
                              handleInputChange("line22", "D");
                            } else {
                              handleInputChange("line22", ""); // Optional: unset if unchecked
                            }
                          }} />
                          <label htmlFor="op-d" className="text-sm leading-tight whitespace-nowrap">
                            D. Interstate Hazmat Shipper
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="op-e" checked={formData.line22 === 'E'} onCheckedChange={(checked) => {
                            if (checked) {
                              handleInputChange("line22", "E");
                            } else {
                              handleInputChange("line22", ""); // Optional: unset if unchecked
                            }
                          }} />
                          <label htmlFor="op-e" className="text-sm leading-tight whitespace-nowrap">
                            E. Intrastate Hazmat Shipper
                          </label>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                )}

                {selectedChanges.includes("classification") && (
                  <TabsContent value="classification" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="classification">Classification</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="flex items-start gap-2">
                          <Checkbox
                            id="op-a"
                            checked={formData?.line23?.includes("Auth. For Hire")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line23", [...(formData.line23 || []), "Auth. For Hire"]);
                              } else {
                                handleInputChange("line23", formData.line23?.filter(item => item !== "Auth. For Hire"));
                              }
                            }}
                          />
                          <label htmlFor="op-a" className="text-sm leading-tight">
                            A. Authorized For-Hire
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="op-d" checked={formData?.line23?.includes("Priv. Pass. (Business)")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line23", [...(formData.line23 || []), "Priv. Pass. (Business)"]);
                              } else {
                                handleInputChange("line23", formData.line23?.filter(item => item !== "Priv. Pass. (Business)"));
                              }
                            }} />
                          <label htmlFor="op-d" className="text-sm leading-tight">
                            D. Private Motor Carrier of Passengers <span className="italic">(Business)</span>
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="op-f" checked={formData?.line23?.includes("Migrant")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line23", [...(formData.line23 || []), "Migrant"]);
                              } else {
                                handleInputChange("line23", formData.line23?.filter(item => item !== "Migrant"));
                              }
                            }} />
                          <label htmlFor="op-f" className="text-sm leading-tight">
                            F. Migrant
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="op-b" checked={formData?.line23?.includes("Exempt For Hire")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line23", [...(formData.line23 || []), "Exempt For Hire"]);
                              } else {
                                handleInputChange("line23", formData.line23?.filter(item => item !== "Exempt For Hire"));
                              }
                            }} />
                          <label htmlFor="op-b" className="text-sm leading-tight">
                            B. Exempt For-Hire
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="op-e" checked={formData?.line23?.includes("Priv. Pass.(Non-business)")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line23", [...(formData.line23 || []), "Priv. Pass.(Non-business)"]);
                              } else {
                                handleInputChange("line23", formData.line23?.filter(item => item !== "Priv. Pass.(Non-business)"));
                              }
                            }} />
                          <label htmlFor="op-e" className="text-sm leading-tight">
                            E. Private Motor Carrier of Passengers <span className="italic">(Non-Business)</span>
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="op-g" checked={formData?.line23?.includes("U.S. Mail")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line23", [...(formData.line23 || []), "U.S. Mail"]);
                              } else {
                                handleInputChange("line23", formData.line23?.filter(item => item !== "U.S. Mail"));
                              }
                            }} />
                          <label htmlFor="op-g" className="text-sm leading-tight">
                            G. U.S. Mail
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="op-c" checked={formData?.line23?.includes("Private(Property)")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line23", [...(formData.line23 || []), "Private(Property)"]);
                              } else {
                                handleInputChange("line23", formData.line23?.filter(item => item !== "Private(Property)"));
                              }
                            }} />
                          <label htmlFor="op-c" className="text-sm leading-tight">
                            C. Private Property
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="op-h" checked={formData?.line23?.includes("Fed. Gov't")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line23", [...(formData.line23 || []), "Fed. Gov't"]);
                              } else {
                                handleInputChange("line23", formData.line23?.filter(item => item !== "Fed. Gov't"));
                              }
                            }} />
                          <label htmlFor="op-h" className="text-sm leading-tight">
                            H. Federal Government
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="op-i" checked={formData?.line23?.includes("State Gov't")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line23", [...(formData.line23 || []), "State Gov't"]);
                              } else {
                                handleInputChange("line23", formData.line23?.filter(item => item !== "State Gov't"));
                              }
                            }} />
                          <label htmlFor="op-i" className="text-sm leading-tight">
                            I. State Government
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="op-j" checked={formData?.line23?.includes("Local Gov't")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line23", [...(formData.line23 || []), "Local Gov't"]);
                              } else {
                                handleInputChange("line23", formData.line23?.filter(item => item !== "Local Gov't"));
                              }
                            }} />
                          <label htmlFor="op-j" className="text-sm leading-tight">
                            J. Local Government
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="op-k" checked={formData?.line23?.includes("Indian Nation")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line23", [...(formData.line23 || []), "Indian Nation"]);
                              } else {
                                handleInputChange("line23", formData.line23?.filter(item => item !== "Indian Nation"));
                              }
                            }} />
                          <label htmlFor="op-k" className="text-sm leading-tight">
                            K. Indian Tribe
                          </label>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                )}

                {selectedChanges.includes("cargo") && (
                  <TabsContent value="cargo" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cargo">Cargo Classifications</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-a" checked={formData?.line24?.includes("General Freight")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "General Freight"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "General Freight"));
                              }
                            }} />
                          <label htmlFor="cargo-a" className="text-sm leading-tight">
                            A. General Freight
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-i" checked={formData?.line24?.includes("Machinery, Large Objects")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Machinery, Large Objects"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Machinery, Large Objects"));
                              }
                            }} />
                          <label htmlFor="cargo-i" className="text-sm leading-tight">
                            I. Machinery, Large Objects
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-q" checked={formData?.line24?.includes("Coal/Coke")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Coal/Coke"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Coal/Coke"));
                              }
                            }} />
                          <label htmlFor="cargo-q" className="text-sm leading-tight">
                            Q. Coal/Coke
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-b" checked={formData?.line24?.includes("Household Goods")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Household Goods"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Household Goods"));
                              }
                            }} />
                          <label htmlFor="cargo-b" className="text-sm leading-tight">
                            B. Household Goods
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-j" checked={formData?.line24?.includes("Fresh Produce")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Fresh Produce"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Fresh Produce"));
                              }
                            }} />
                          <label htmlFor="cargo-j" className="text-sm leading-tight">
                            J. Fresh Produce
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-r" checked={formData?.line24?.includes("Meat")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Meat"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Meat"));
                              }
                            }} />
                          <label htmlFor="cargo-r" className="text-sm leading-tight">
                            R. Meat
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-c" checked={formData?.line24?.includes("Metal: sheets, coils, rolls")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Metal: sheets, coils, rolls"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Metal: sheets, coils, rolls"));
                              }
                            }} />
                          <label htmlFor="cargo-c" className="text-sm leading-tight">
                            C. Metal: Sheets, Coils, Rolls
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-k" checked={formData?.line24?.includes("Liquids/Gases")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Liquids/Gases"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Liquids/Gases"));
                              }
                            }} />
                          <label htmlFor="cargo-k" className="text-sm leading-tight">
                            K. Liquids/Gases
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-s" checked={formData?.line24?.includes("Garbage/Refuse")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Garbage/Refuse"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Garbage/Refuse"));
                              }
                            }} />
                          <label htmlFor="cargo-s" className="text-sm leading-tight">
                            S. Garbage, Refuse, Trash
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-d" checked={formData?.line24?.includes("Motor Vehicles")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Motor Vehicles"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Motor Vehicles"));
                              }
                            }} />
                          <label htmlFor="cargo-d" className="text-sm leading-tight">
                            D. Motor Vehicles
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-l" checked={formData?.line24?.includes("Intermodal Cont.")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Intermodal Cont."]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Intermodal Cont."));
                              }
                            }} />
                          <label htmlFor="cargo-l" className="text-sm leading-tight">
                            L. Intermodal Container
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-t" checked={formData?.line24?.includes("US Mail")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "US Mail"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "US Mail"));
                              }
                            }} />
                          <label htmlFor="cargo-t" className="text-sm leading-tight">
                            T. U.S. Mail
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-e" checked={formData?.line24?.includes("Drive/Tow away")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Drive/Tow away"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Drive/Tow away"));
                              }
                            }} />
                          <label htmlFor="cargo-e" className="text-sm leading-tight">
                            E. Drive Away/Towaway
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-m" checked={formData?.line24?.includes("Passengers")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Passengers"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Passengers"));
                              }
                            }} />
                          <label htmlFor="cargo-m" className="text-sm leading-tight">
                            M. Passengers
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-u" checked={formData?.line24?.includes("Chemicals")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Chemicals"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Chemicals"));
                              }
                            }} />
                          <label htmlFor="cargo-u" className="text-sm leading-tight">
                            U. Chemicals
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-f" checked={formData?.line24?.includes("Logs, Poles, Beams, Lumber")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Logs, Poles, Beams, Lumber"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Logs, Poles, Beams, Lumber"));
                              }
                            }} />
                          <label htmlFor="cargo-f" className="text-sm leading-tight">
                            F. Logs, Poles, Beams, Lumber
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-n" checked={formData?.line24?.includes("Oilfield Equipment")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Oilfield Equipment"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Oilfield Equipment"));
                              }
                            }} />
                          <label htmlFor="cargo-n" className="text-sm leading-tight">
                            N. Oil Field Equipment
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-v" checked={formData?.line24?.includes("Commodities Dry Bulk")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Commodities Dry Bulk"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Commodities Dry Bulk"));
                              }
                            }} />
                          <label htmlFor="cargo-v" className="text-sm leading-tight">
                            V. Commodities Dry Bulk
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-g" checked={formData?.line24?.includes("Building Materials")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Building Materials"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Building Materials"));
                              }
                            }} />
                          <label htmlFor="cargo-g" className="text-sm leading-tight">
                            G. Building Materials
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-o" checked={formData?.line24?.includes("Livestock")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Livestock"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Livestock"));
                              }
                            }} />
                          <label htmlFor="cargo-o" className="text-sm leading-tight">
                            O. Livestock
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-w" checked={formData?.line24?.includes("Refrigerated Food")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Refrigerated Food"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Refrigerated Food"));
                              }
                            }} />
                          <label htmlFor="cargo-w" className="text-sm leading-tight">
                            W. Refrigerated Food
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-h" checked={formData?.line24?.includes("Mobile Homes")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Mobile Homes"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Mobile Homes"));
                              }
                            }} />
                          <label htmlFor="cargo-h" className="text-sm leading-tight">
                            H. Mobile Homes
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-p" checked={formData?.line24?.includes("Grain, Feed, Hay")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Grain, Feed, Hay"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Grain, Feed, Hay"));
                              }
                            }} />
                          <label htmlFor="cargo-p" className="text-sm leading-tight">
                            P. Grain, Feed, Hay
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-x" checked={formData?.line24?.includes("Beverages")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Beverages"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Beverages"));
                              }
                            }} />
                          <label htmlFor="cargo-x" className="text-sm leading-tight">
                            X. Beverages
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-y" checked={formData?.line24?.includes("Paper Products")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Paper Products"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Paper Products"));
                              }
                            }} />
                          <label htmlFor="cargo-y" className="text-sm leading-tight">
                            Y. Paper Product
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-z" checked={formData?.line24?.includes("Utilities")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Utilities"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Utilities"));
                              }
                            }} />
                          <label htmlFor="cargo-z" className="text-sm leading-tight">
                            Z. Utility
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-aa" checked={formData?.line24?.includes("Agricultural/Farm Supplies")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Agricultural/Farm Supplies"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Agricultural/Farm Supplies"));
                              }
                            }} />
                          <label htmlFor="cargo-aa" className="text-sm leading-tight">
                            AA. Farm Supplies
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-bb" checked={formData?.line24?.includes("Construction")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Construction"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Construction"));
                              }
                            }} />
                          <label htmlFor="cargo-bb" className="text-sm leading-tight">
                            BB. Construction
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-cc" checked={formData?.line24?.includes("Water Well")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24", [...(formData.line24 || []), "Water Well"]);
                              } else {
                                handleInputChange("line24", formData.line24?.filter(item => item !== "Water Well"));
                              }
                            }} />
                          <label htmlFor="cargo-cc" className="text-sm leading-tight">
                            CC. Water Well
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="cargo-dd" checked={(formData?.line24_other || "")?.length > 0}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("line24_other", " ");
                              } else {
                                handleInputChange("line24_other", "");
                              }
                            }} />
                          <label htmlFor="cargo-dd" className="text-sm leading-tight">
                            DD. Other listed below:
                          </label>
                        </div>
                        <div className="col-span-2 md:col-span-2">
                          {/* <div className="border h-8 w-full text-sm pt-1 pl-2">{carrierData.line24_other.length > 0 ? carrierData.line24_other : ""}</div> */}
                          <Input
                            id="cargoOtherDescribe"
                            value={formData.line24_other}
                            onChange={(e) => handleInputChange("line24_other", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                )}

                {selectedChanges.includes("trucks") && (
                  <TabsContent value="trucks" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="trucks">NUMBER OF COMMERCIAL MOTOR VEHICLES</Label>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr>
                              <th className="border p-1"></th>
                              <th className="border p-1 whitespace-nowrap text-center">Straight Trucks</th>
                              <th className="border p-1 whitespace-nowrap text-center">Truck Tractors</th>
                              <th className="border p-1 whitespace-nowrap text-center">Trailers</th>
                              <th className="border p-1 whitespace-nowrap text-center">
                                Hazmat
                                <br />
                                Cargo
                                <br />
                                Tank
                                <br />
                                Trucks
                              </th>
                              <th className="border p-1 whitespace-nowrap text-center">
                                Hazmat
                                <br />
                                Cargo
                                <br />
                                Tank
                                <br />
                                Trailers
                              </th>
                              <th className="border p-1 whitespace-nowrap text-center">Motor-coach</th>
                              <th className="border p-1 whitespace-nowrap text-center" colSpan={9}>
                                Number of vehicles carrying number of passengers{" "}
                                <span className="italic">(including the driver)</span>
                              </th>
                            </tr>
                            <tr>
                              <th className="border p-1"></th>
                              <th className="border p-1"></th>
                              <th className="border p-1"></th>
                              <th className="border p-1"></th>
                              <th className="border p-1"></th>
                              <th className="border p-1"></th>
                              <th className="border p-1"></th>
                              <th className="border p-1 whitespace-nowrap text-center" colSpan={3}>
                                School Bus
                              </th>
                              <th className="border p-1 whitespace-nowrap text-center">Bus</th>
                              <th className="border p-1 whitespace-nowrap text-center" colSpan={2}>
                                Passenger Van
                              </th>
                              <th className="border p-1 whitespace-nowrap text-center" colSpan={3}>
                                Limousine
                              </th>
                            </tr>
                            <tr>
                              <th className="border p-1"></th>
                              <th className="border p-1"></th>
                              <th className="border p-1"></th>
                              <th className="border p-1"></th>
                              <th className="border p-1"></th>
                              <th className="border p-1"></th>
                              <th className="border p-1"></th>
                              <th className="border p-1 whitespace-nowrap text-center">1-8</th>
                              <th className="border p-1 whitespace-nowrap text-center">9-15</th>
                              <th className="border p-1 whitespace-nowrap text-center">16+</th>
                              <th className="border p-1 whitespace-nowrap text-center">16+</th>
                              <th className="border p-1 whitespace-nowrap text-center">1-8</th>
                              <th className="border p-1 whitespace-nowrap text-center">9-15</th>
                              <th className="border p-1 whitespace-nowrap text-center">1-8</th>
                              <th className="border p-1 whitespace-nowrap text-center">9-15</th>
                              <th className="border p-1 whitespace-nowrap text-center">16+</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border p-1 whitespace-nowrap text-center font-bold">Owned</td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.owntruck} onChange={(e) => handleNestedInputChange("line26a", "owntruck", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.owntract} onChange={(e) => handleNestedInputChange("line26a", "owntract", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.owntrail} onChange={(e) => handleNestedInputChange("line26a", "owntrail", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.own_haz_truck} onChange={(e) => handleNestedInputChange("line26a", "own_haz_truck", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.own_haz_trail} onChange={(e) => handleNestedInputChange("line26a", "own_haz_trail", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.owncoach} onChange={(e) => handleNestedInputChange("line26a", "owncoach", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.ownschool_1_8} onChange={(e) => handleNestedInputChange("line26a", "ownschool_1_8", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.ownschool_9_15} onChange={(e) => handleNestedInputChange("line26a", "ownschool_9_15", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.ownschool_16} onChange={(e) => handleNestedInputChange("line26a", "ownschool_16", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.ownbus_16} onChange={(e) => handleNestedInputChange("line26a", "ownbus_16", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.ownvan_1_8} onChange={(e) => handleNestedInputChange("line26a", "ownvan_1_8", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.ownvan_9_15} onChange={(e) => handleNestedInputChange("line26a", "ownvan_9_15", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.ownlimo_1_8} onChange={(e) => handleNestedInputChange("line26a", "ownlimo_1_8", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.ownlimo_9_15} onChange={(e) => handleNestedInputChange("line26a", "ownlimo_9_15", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.ownlimo_16} onChange={(e) => handleNestedInputChange("line26a", "ownlimo_16", e.target.value)} />
                              </td>
                            </tr>
                            <tr>
                              <td className="border p-1 whitespace-nowrap text-center font-bold">Term Leased</td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trmtruck} onChange={(e) => handleNestedInputChange("line26a", "trmtruck", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trmtract} onChange={(e) => handleNestedInputChange("line26a", "trmtract", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trmtrail} onChange={(e) => handleNestedInputChange("line26a", "trmtrail", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.term_haz_truck} onChange={(e) => handleNestedInputChange("line26a", "term_haz_truck", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.term_haz_trail} onChange={(e) => handleNestedInputChange("line26a", "term_haz_trail", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trmcoach} onChange={(e) => handleNestedInputChange("line26a", "trmcoach", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trmschool_1_8} onChange={(e) => handleNestedInputChange("line26a", "trmschool_1_8", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trmschool_9_15} onChange={(e) => handleNestedInputChange("line26a", "trmschool_9_15", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trmschool_16} onChange={(e) => handleNestedInputChange("line26a", "trmschool_16", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trmbus_16} onChange={(e) => handleNestedInputChange("line26a", "trmbus_16", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trmvan_1_8} onChange={(e) => handleNestedInputChange("line26a", "trmvan_1_8", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trmvan_9_15} onChange={(e) => handleNestedInputChange("line26a", "trmvan_9_15", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trmlimo_1_8} onChange={(e) => handleNestedInputChange("line26a", "trmlimo_1_8", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trmlimo_9_15} onChange={(e) => handleNestedInputChange("line26a", "trmlimo_9_15", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trmlimo_16} onChange={(e) => handleNestedInputChange("line26a", "trmlimo_16", e.target.value)} />
                              </td>
                            </tr>
                            <tr>
                              <td className="border p-1 whitespace-nowrap text-center font-bold">Trip Leased</td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trptruck} onChange={(e) => handleNestedInputChange("line26a", "trptruck", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trptract} onChange={(e) => handleNestedInputChange("line26a", "trptract", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trptrail} onChange={(e) => handleNestedInputChange("line26a", "trptrail", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trip_haz_truck} onChange={(e) => handleNestedInputChange("line26a", "trip_haz_truck", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trip_haz_trail} onChange={(e) => handleNestedInputChange("line26a", "trip_haz_trail", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trpcoach} onChange={(e) => handleNestedInputChange("line26a", "trpcoach", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trpschool_1_8} onChange={(e) => handleNestedInputChange("line26a", "trpschool_1_8", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trpschool_9_15} onChange={(e) => handleNestedInputChange("line26a", "trpschool_9_15", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trpschool_16} onChange={(e) => handleNestedInputChange("line26a", "trpschool_16", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trpbus_16} onChange={(e) => handleNestedInputChange("line26a", "trpbus_16", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trpvan_1_8} onChange={(e) => handleNestedInputChange("line26a", "trpvan_1_8", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trpvan_9_15} onChange={(e) => handleNestedInputChange("line26a", "trpvan_9_15", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trplimo_1_8} onChange={(e) => handleNestedInputChange("line26a", "trplimo_1_8", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trplimo_9_15} onChange={(e) => handleNestedInputChange("line26a", "trplimo_9_15", e.target.value)} />
                              </td>
                              <td className="border p-1">
                                <Input className="w-full h-8 border-none" value={formData?.line26a?.trplimo_16} onChange={(e) => handleNestedInputChange("line26a", "trplimo_16", e.target.value)} />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>
                )}

                {selectedChanges.includes("drivers") && (
                  <TabsContent value="drivers" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="drivers">DRIVER INFORMATION</Label>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr>
                              <th className="border p-2">DRIVER INFORMATION</th>
                              <th className="border p-2 text-center">INTERSTATE</th>
                              <th className="border p-2 text-center">INTRASTATE</th>
                              <th className="border p-2 text-center">TOTAL DRIVERS</th>
                              <th className="border p-2 text-center">TOTAL CDL DRIVERS</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border p-2 whitespace-nowrap">Within 100-Mile Radius</td>
                              <td className="border p-2">
                                <Input className="w-full h-8 border-none" value={formData?.line27?.interstate_within_100_miles} onChange={(e) => handleNestedInputChange("line27", "interstate_within_100_miles", e.target.value)} />
                              </td>
                              <td className="border p-2">
                                <Input className="w-full h-8 border-none" value={formData?.line27?.intrastate_within_100_miles} onChange={(e) => handleNestedInputChange("line27", "intrastate_within_100_miles", e.target.value)} />
                              </td>
                              <td className="border p-2" rowSpan={2}>
                                <Input className="w-full h-8 border-none" value={formData?.line27?.total_drivers} onChange={(e) => handleNestedInputChange("line27", "total_drivers", e.target.value)} />
                              </td>
                              {/* Merged Total Drivers input, spans both rows */}
                              <td className="border p-2 align-middle" rowSpan={2}>
                                <Input className="w-full h-8 border-none" value={formData?.line27?.total_cdl} onChange={(e) => handleNestedInputChange("line27", "total_cdl", e.target.value)} />
                              </td>
                            </tr>
                            <tr>
                              <td className="border p-2 whitespace-nowrap">Beyond 100-Mile Radius</td>
                              <td className="border p-2">
                                <Input className="w-full h-8 border-none" value={formData?.line27?.interstate_beyond_100_miles} onChange={(e) => handleNestedInputChange("line27", "interstate_beyond_100_miles", e.target.value)} />
                              </td>
                              <td className="border p-2">
                                <Input className="w-full h-8 border-none" value={formData?.line27?.intrastate_beyond_100_miles} onChange={(e) => handleNestedInputChange("line27", "intrastate_beyond_100_miles", e.target.value)} />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              {
                (selectedChanges.length == 1 || selectedChanges.indexOf(activeTab) == selectedChanges.length - 1) && <div className="w-full">
                  <div className="flex items-center space-x-2 w-full mb-4">
                    <p className="text-sm">Would you like to make additional changes?</p>
                    <div className="flex space-x-2 ml-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className={!moreChanges ? "bg-blue-50" : ""}
                        onClick={() => setMoreChanges(false)}
                      >
                        <X className={`h-4 w-4 ${!moreChanges ? "text-blue-900" : "text-gray-500"} mr-1`} />
                        No
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={moreChanges ? "bg-blue-50" : ""}
                        onClick={() => setMoreChanges(true)}
                      >
                        <Check className={`h-4 w-4 ${moreChanges ? "text-blue-900" : "text-gray-500"} mr-1`} />
                        Yes
                      </Button>
                    </div>
                  </div>
                  <Button onClick={handleSubmit} className="w-full bg-blue-900 hover:bg-blue-800" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Save className="mr-2 h-5 w-5" />
                        Save Changes
                      </span>
                    )}
                  </Button>
                </div>
              }
              {
                selectedChanges.length > 1 && <div className="flex justify-between w-full space-x-4">
                  <Button onClick={handlePrev} className="w-full bg-blue-900 hover:bg-blue-800" disabled={isSubmitting || selectedChanges.indexOf(activeTab) == 0}>
                    <span className="flex items-center">
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Prev
                    </span>
                  </Button>
                  <Button onClick={handleNext} className="w-full bg-blue-900 hover:bg-blue-800" disabled={isSubmitting || selectedChanges.indexOf(activeTab) == selectedChanges.length - 1}>
                    <span className="flex items-center">
                      Next
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  </Button>
                </div>
              }

            </CardFooter>
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

