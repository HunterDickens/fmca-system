"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, FileText, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Notification, User } from "@/lib/types";
import { parseAccessToken } from "@/lib/parse";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import axios from "@/axios/axiosInstance";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";

interface CarrierData {
  line1: string;
  line2: string;
  line3_7: {
    line3: string;
    line4: string;
    line5: string;
    line6: string;
    line7: string;
  };
  line8_12: {
    isSame: boolean;
    line8: string;
    line9: string;
    line10: string;
    line11: string;
    line12: "";
  };
  line13_15: {
    line13: string;
    line14: string;
    line15: string;
  };
  line16_19: {
    line16: string;
    line17: string;
    line18: string;
    line19: string;
  };
  line22: string;
  line23: Array<string>;
  line24: Array<string>;
  line24_other: string;
  line25: string;
  line26a: {
    owntruck: string;
    owntract: string;
    owntrail: string;
    owncoach: string;
    ownschool_1_8: string;
    ownschool_9_15: string;
    ownschool_16: string;
    ownbus_16: string;
    ownvan_1_8: string;
    ownvan_9_15: string;
    ownlimo_1_8: string;
    ownlimo_9_15: string;
    ownlimo_16: string;

    trmtruck: string;
    trmtract: string;
    trmtrail: string;
    trmcoach: string;
    trmschool_1_8: string;
    trmschool_9_15: string;
    trmschool_16: string;
    trmbus_16: string;
    trmvan_1_8: string;
    trmvan_9_15: string;
    trmlimo_1_8: string;
    trmlimo_9_15: string;
    trmlimo_16: string;

    trptruck: string;
    trptract: string;
    trptrail: string;
    trpcoach: string;
    trpschool_1_8: string;
    trpschool_9_15: string;
    trpschool_16: string;
    trpbus_16: string;
    trpvan_1_8: string;
    trpvan_9_15: string;
    trplimo_1_8: string;
    trplimo_9_15: string;
    trplimo_16: string;

    own_haz_truck: string;
    own_haz_trail: string;
    term_haz_truck: string;
    term_haz_trail: string;
    trip_haz_truck: string;
    trip_haz_trail: string;
  };
  line27: {
    interstate_within_100_miles: string;
    intrastate_within_100_miles: string;
    interstate_beyond_100_miles: string;
    intrastate_beyond_100_miles: string;
    total_drivers: string;
    total_cdl: string;
  };
}

export default function FormPreview() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usdotNumber, setUsdotNumber] = useState("");
  const [email, setEmail] = useState("");
  const [mileage, setMileage] = useState("");
  const [employerNumber, setEmployerNumber] = useState("");
  const [carrierData, setCarrierData] = useState<CarrierData | null>(null);
  const [needChanges, setNeedChanges] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    const accessToken = localStorage.getItem("accessToken") || "";
    const user = parseAccessToken(accessToken);
    if (!user) {
      router.push("/login");
      return;
    }

    // Get data from previous steps
    const storedUsdot = localStorage.getItem("usdotNumber");
    const storedEmail = localStorage.getItem("carrierEmail");
    const storedMileage = localStorage.getItem("carrierMileage");
    const storedEmployerNumber = localStorage.getItem("employerNumber");
    const storedCarrierData = localStorage.getItem("carrierData");

    if (
      !storedUsdot ||
      !storedEmail ||
      !storedMileage ||
      !storedCarrierData ||
      !storedEmployerNumber
    ) {
      router.push("/filing/new");
      return;
    }

    setUsdotNumber(storedUsdot);
    setEmail(storedEmail);
    setMileage(storedMileage);
    setEmployerNumber(storedEmployerNumber);
    setCarrierData(JSON.parse(storedCarrierData));
    setUser(user);
    setIsLoading(false);
  }, [router]);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);

    try {
      // In a real app, this would generate a PDF using a library like react-pdf
      // For demo purposes, we'll just simulate PDF generation
      // await new Promise((resolve) => setTimeout(resolve, 2000))

      const formData = {
        ...carrierData,
        line20: email,
        line21: mileage,
        line16_19: {
          ...carrierData?.line16_19,
          line19: employerNumber,
        },
      };
      await axios
        .post("/filing/generate_pdf", formData)
        .then((response) => {
          if (response.status === 201) {
            if (response.data.filing_name) {
              toast({
                title: "PDF Generated",
                description: `${response.data.filing_name} has been generated successfully.`,
                variant: "info",
              });

              localStorage.setItem("filingName", response.data.filing_name);
              // localStorage.setItem(
              //   "filingNameTrimmed",
              //   response.data.filing_name_trimmed
              // );
              // Navigate to the success page
              router.push("/filing/success");
            }
          }
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "Failed to generate PDF. Please try again.",
            variant: "destructive",
          });
        });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMakeChanges = () => {
    setNeedChanges(true);
    router.push("/filing/changes");
    /* toast({
      title: "Work in Progress",
      description: "It's currently in development.",
      variant: "info"
    }) */
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (!user || !carrierData) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-blue-900 text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-bold">FMCA Filings Generator</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        <Link
          href="/filing/carrier-info"
          className="inline-flex items-center text-blue-900 hover:text-blue-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Carrier Information
        </Link>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6 space-x-4">
            <div className="bg-gray-300 text-white font-bold w-[50px] h-[50px] rounded-full flex items-center justify-center">
              <span className="text-white font-bold">1</span>
            </div>
            <div className="bg-gray-300 text-white font-bold w-[50px] h-[50px] rounded-full flex items-center justify-center">
              <span className="text-white font-bold">2</span>
            </div>
            <div className="bg-blue-900 text-white font-bold w-[50px] h-[50px] rounded-full flex items-center justify-center">
              <span className="text-white font-bold">3</span>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w- w-full">
                  <div className="border border-blue-800 p-3 mb-6 justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center text-white">
                        <span className="text-xl">✈</span>
                      </div>
                      <div className="flex-1">
                        <div className="whitespace-nowrap font-semibold">
                          United States Department of Transportation
                        </div>
                        <div className="whitespace-nowrap font-semibold">
                          Federal Motor Carrier Safety Administration
                        </div>
                      </div>
                      <FileText className="h-10 w-10 text-blue-900" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-6 text-center">
                <div className="text-3xl font-bold text-blue-800">
                  Motor Carrier Identification Report
                </div>
                <div className="italic font-bold whitespace-nowrap">
                  (Application for USDOT Number)
                </div>
                <div className="text-3xl font-bold mt-2 text-blue-800 whitespace-nowrap">
                  FORM MCS-150
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Reason for Filing */}
                <div className="mb-6">
                  <div className="font-bold text-blue-800 whitespace-nowrap mb-2">
                    REASON FOR FILING{" "}
                    <span className="font-normal text-gray-600 italic">
                      (select only one)
                    </span>
                    :
                  </div>
                  <RadioGroup
                    defaultValue="biennial"
                    className="flex flex-wrap gap-x-6 gap-y-2"
                    disabled
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="new" id="new" />
                      <Label htmlFor="new" className="whitespace-nowrap">
                        New Application
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="biennial" id="biennial" />
                      <Label htmlFor="biennial" className="whitespace-nowrap">
                        Biennial Update or Changes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="out" id="out" />
                      <Label htmlFor="out" className="whitespace-nowrap">
                        Out of Business Notification
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="reapplication"
                        id="reapplication"
                      />
                      <Label
                        htmlFor="reapplication"
                        className="whitespace-nowrap"
                      >
                        Reapplication (after revocation of new entrant)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="reactivate" id="reactivate" />
                      <Label htmlFor="reactivate" className="whitespace-nowrap">
                        Reactivate
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                {/* Business Information */}
                <div className="space-y-4 mb-6">
                  <div className="space-y-1">
                    <div className="font-bold text-blue-800 whitespace-nowrap">
                      1. LEGAL BUSINESS NAME:
                    </div>
                    <Input
                      className="w-full"
                      value={carrierData?.line1}
                      disabled
                      readOnly
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="font-bold text-blue-800">
                      2. DOING BUSINESS AS NAME{" "}
                      <span className="font-normal text-gray-600 italic">
                        (if different from Legal Business Name)
                      </span>
                      :
                    </div>
                    <Input
                      className="w-full"
                      value={carrierData?.line2}
                      disabled
                      readOnly
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="font-bold text-blue-800">
                      3-7. PRINCIPAL PLACE OF BUSINESS{" "}
                      <span className="font-normal text-gray-600 italic">
                        (see 49 CFR 390.5T)
                      </span>
                      :
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                      <div className="md:col-span-4">
                        <div className="text-xs whitespace-nowrap">
                          3. STREET ADDRESS/ROUTE NUMBER
                        </div>
                        <Input
                          className="w-full"
                          value={carrierData.line3_7?.line3}
                          disabled
                          readOnly
                        />
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-xs whitespace-nowrap">4. CITY</div>
                        <Input
                          className="w-full"
                          value={carrierData.line3_7?.line4}
                          disabled
                          readOnly
                        />
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-xs whitespace-nowrap">
                          5. STATE/PROVINCE
                        </div>
                        <Input
                          className="w-full"
                          value={carrierData.line3_7?.line5}
                          disabled
                          readOnly
                        />
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-xs whitespace-nowrap">
                          6. ZIP CODE
                        </div>
                        <Input
                          className="w-full"
                          value={carrierData.line3_7?.line6}
                          disabled
                          readOnly
                        />
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-xs whitespace-nowrap">
                          7. COLONIA{" "}
                          <span className="italic">(Mexico only)</span>
                        </div>
                        <Input
                          className="w-full"
                          value={carrierData.line3_7?.line7}
                          disabled
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="font-bold text-blue-800 flex items-center gap-4">
                      8-12. MAILING ADDRESS:
                      <div className="flex items-center gap-2">
                        <RadioGroup
                          defaultValue={`${
                            carrierData.line8_12?.isSame ? "same" : "below"
                          }`}
                          className="flex gap-6"
                          disabled
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="same" id="same" />
                            <Label htmlFor="same">
                              Same as Principal Address
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="below" id="below" />
                            <Label htmlFor="below">
                              Mailing address below:
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                      <div className="md:col-span-4">
                        <div className="text-xs whitespace-nowrap">
                          8. STREET ADDRESS/ROUTE NUMBER
                        </div>
                        <Input
                          className="w-full"
                          value={carrierData.line8_12?.line8}
                          disabled
                          readOnly
                        />
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-xs whitespace-nowrap">9. CITY</div>
                        <Input
                          className="w-full"
                          value={carrierData.line8_12?.line9}
                          disabled
                          readOnly
                        />
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-xs whitespace-nowrap">
                          10. STATE/PROVINCE
                        </div>
                        <Input
                          className="w-full"
                          value={carrierData.line8_12?.line10}
                          disabled
                          readOnly
                        />
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-xs whitespace-nowrap">
                          11. ZIP CODE
                        </div>
                        <Input
                          className="w-full"
                          value={carrierData.line8_12?.line11}
                          disabled
                          readOnly
                        />
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-xs whitespace-nowrap">
                          12. COLONIA{" "}
                          <span className="italic">(Mexico only)</span>
                        </div>
                        <Input
                          className="w-full"
                          value={carrierData.line8_12?.line12}
                          disabled
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="font-bold text-blue-800 whitespace-nowrap">
                      13-15. CONTACT NUMBERS:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        <div className="text-xs whitespace-nowrap">
                          13. PRINCIPAL BUSINESS PHONE NUMBER
                        </div>
                        <Input
                          className="w-full"
                          value={carrierData.line13_15?.line13}
                          disabled
                          readOnly
                        />
                      </div>
                      <div>
                        <div className="text-xs whitespace-nowrap">
                          14. PRINCIPAL CONTACT CELL PHONE NUMBER
                        </div>
                        <Input
                          className="w-full"
                          value={carrierData.line13_15?.line14}
                          disabled
                          readOnly
                        />
                      </div>
                      <div>
                        <div className="text-xs whitespace-nowrap">
                          15. PRINCIPAL BUSINESS FAX NUMBER
                        </div>
                        <Input
                          className="w-full"
                          value={carrierData.line13_15?.line15}
                          disabled
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="font-bold text-blue-800 whitespace-nowrap">
                      16-19. IDENTIFICATION NUMBERS:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <div>
                        <div className="text-xs whitespace-nowrap">
                          16. USDOT NUMBER
                        </div>
                        <Input
                          className="w-full"
                          value={carrierData.line16_19?.line16}
                          disabled
                          readOnly
                        />
                      </div>
                      <div>
                        <div className="text-xs whitespace-nowrap">
                          17. MC or MX NUMBER
                        </div>
                        <Input
                          className="w-full"
                          value={carrierData.line16_19?.line17}
                          disabled
                          readOnly
                        />
                      </div>
                      <div>
                        <div className="text-xs whitespace-nowrap">
                          18. DUN & BRADSTREET NUMBER
                        </div>
                        <Input
                          className="w-full"
                          value={carrierData.line16_19?.line18}
                          disabled
                          readOnly
                        />
                      </div>
                      <div>
                        <div className="text-xs whitespace-nowrap">
                          19. IRS/TAX ID NUMBER
                        </div>
                        <div>
                          <Input
                            className="w-full"
                            value={employerNumber}
                            disabled
                            readOnly
                          />
                          {/* <div className="italic text-[10px]">(see instructions before completing this section)</div> */}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="font-bold text-blue-800 whitespace-nowrap">
                      20. E-MAIL ADDRESS:
                    </div>
                    <Input className="w-full" value={email} disabled readOnly />
                  </div>

                  <div className="space-y-1">
                    <div className="font-bold text-blue-800">
                      21. CARRIER MILEAGE{" "}
                      <span className="font-normal text-gray-600 italic">
                        (to nearest 10,000 miles for the previous 12 months)
                      </span>
                      :
                    </div>
                    <Input
                      className="w-full"
                      value={mileage}
                      disabled
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="font-bold text-blue-800 whitespace-nowrap">
                      22. COMPANY OPERATIONS{" "}
                      <span className="font-normal text-gray-600 italic">
                        (check all that apply)
                      </span>
                      :
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="op-a"
                          checked={carrierData.line22 === "A"}
                        />
                        <label
                          htmlFor="op-a"
                          className="text-sm leading-tight whitespace-nowrap"
                        >
                          A. Interstate Carrier
                        </label>
                      </div>
                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="op-b"
                          checked={carrierData.line22 === "B"}
                        />
                        <label
                          htmlFor="op-b"
                          className="text-sm leading-tight whitespace-nowrap"
                        >
                          B. Intrastate Hazmat Carrier
                        </label>
                      </div>
                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="op-c"
                          checked={carrierData.line22 === "C"}
                        />
                        <label
                          htmlFor="op-c"
                          className="text-sm leading-tight whitespace-nowrap"
                        >
                          C. Intrastate Non-Hazmat Carrier
                        </label>
                      </div>
                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="op-d"
                          checked={carrierData.line22 === "D"}
                        />
                        <label
                          htmlFor="op-d"
                          className="text-sm leading-tight whitespace-nowrap"
                        >
                          D. Interstate Hazmat Shipper
                        </label>
                      </div>
                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="op-e"
                          checked={carrierData.line22 === "E"}
                        />
                        <label
                          htmlFor="op-e"
                          className="text-sm leading-tight whitespace-nowrap"
                        >
                          E. Intrastate Hazmat Shipper
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Operation Classifications */}
                <div className="mb-6 border-b pb-4">
                  <div className="font-bold text-blue-800 mb-2">
                    23. OPERATION CLASSIFICATIONS{" "}
                    <span className="font-normal text-gray-600 italic">
                      (check all that apply)
                    </span>
                    :
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="op-a"
                        checked={carrierData.line23.includes("Auth. For Hire")}
                      />
                      <label htmlFor="op-a" className="text-sm leading-tight">
                        A. Authorized For-Hire
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="op-d"
                        checked={carrierData.line23.includes(
                          "Priv. Pass. (Business)"
                        )}
                      />
                      <label htmlFor="op-d" className="text-sm leading-tight">
                        D. Private Motor Carrier of Passengers{" "}
                        <span className="italic">(Business)</span>
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="op-f"
                        checked={carrierData.line23.includes("Migrant")}
                      />
                      <label htmlFor="op-f" className="text-sm leading-tight">
                        F. Migrant
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="op-b"
                        checked={carrierData.line23.includes("Exempt For Hire")}
                      />
                      <label htmlFor="op-b" className="text-sm leading-tight">
                        B. Exempt For-Hire
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="op-e"
                        checked={carrierData.line23.includes(
                          "Priv. Pass.(Non-business)"
                        )}
                      />
                      <label htmlFor="op-e" className="text-sm leading-tight">
                        E. Private Motor Carrier of Passengers{" "}
                        <span className="italic">(Non-Business)</span>
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="op-g"
                        checked={carrierData.line23.includes("U.S. Mail")}
                      />
                      <label htmlFor="op-g" className="text-sm leading-tight">
                        G. U.S. Mail
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="op-c"
                        checked={carrierData.line23.includes(
                          "Private(Property)"
                        )}
                      />
                      <label htmlFor="op-c" className="text-sm leading-tight">
                        C. Private Property
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="op-h"
                        checked={carrierData.line23.includes("Fed. Gov't")}
                      />
                      <label htmlFor="op-h" className="text-sm leading-tight">
                        H. Federal Government
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="op-i"
                        checked={carrierData.line23.includes("State Gov't")}
                      />
                      <label htmlFor="op-i" className="text-sm leading-tight">
                        I. State Government
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="op-j"
                        checked={carrierData.line23.includes("Local Gov't")}
                      />
                      <label htmlFor="op-j" className="text-sm leading-tight">
                        J. Local Government
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="op-k"
                        checked={carrierData.line23.includes("Indian Nation")}
                      />
                      <label htmlFor="op-k" className="text-sm leading-tight">
                        K. Indian Tribe
                      </label>
                    </div>
                  </div>
                </div>

                {/* Cargo Classifications */}
                <div className="mb-6 border-b pb-4">
                  <div className="font-bold text-blue-800 mb-2">
                    24. CARGO CLASSIFICATIONS{" "}
                    <span className="font-normal text-gray-600 italic">
                      (check all that apply)
                    </span>
                    :
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-a"
                        checked={carrierData.line24.includes("General Freight")}
                      />
                      <label
                        htmlFor="cargo-a"
                        className="text-sm leading-tight"
                      >
                        A. General Freight
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-i"
                        checked={carrierData.line24.includes(
                          "Machinery, Large Objects"
                        )}
                      />
                      <label
                        htmlFor="cargo-i"
                        className="text-sm leading-tight"
                      >
                        I. Machinery, Large Objects
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-q"
                        checked={carrierData.line24.includes("Coal/Coke")}
                      />
                      <label
                        htmlFor="cargo-q"
                        className="text-sm leading-tight"
                      >
                        Q. Coal/Coke
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-b"
                        checked={carrierData.line24.includes("Household Goods")}
                      />
                      <label
                        htmlFor="cargo-b"
                        className="text-sm leading-tight"
                      >
                        B. Household Goods
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-j"
                        checked={carrierData.line24.includes("Fresh Produce")}
                      />
                      <label
                        htmlFor="cargo-j"
                        className="text-sm leading-tight"
                      >
                        J. Fresh Produce
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-r"
                        checked={carrierData.line24.includes("Meat")}
                      />
                      <label
                        htmlFor="cargo-r"
                        className="text-sm leading-tight"
                      >
                        R. Meat
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-c"
                        checked={carrierData.line24.includes(
                          "Metal: sheets, coils, rolls"
                        )}
                      />
                      <label
                        htmlFor="cargo-c"
                        className="text-sm leading-tight"
                      >
                        C. Metal: Sheets, Coils, Rolls
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-k"
                        checked={carrierData.line24.includes("Liquids/Gases")}
                      />
                      <label
                        htmlFor="cargo-k"
                        className="text-sm leading-tight"
                      >
                        K. Liquids/Gases
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-s"
                        checked={carrierData.line24.includes("Garbage/Refuse")}
                      />
                      <label
                        htmlFor="cargo-s"
                        className="text-sm leading-tight"
                      >
                        S. Garbage, Refuse, Trash
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-d"
                        checked={carrierData.line24.includes("Motor Vehicles")}
                      />
                      <label
                        htmlFor="cargo-d"
                        className="text-sm leading-tight"
                      >
                        D. Motor Vehicles
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-l"
                        checked={carrierData.line24.includes(
                          "Intermodal Cont."
                        )}
                      />
                      <label
                        htmlFor="cargo-l"
                        className="text-sm leading-tight"
                      >
                        L. Intermodal Container
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-t"
                        checked={carrierData.line24.includes("US Mail")}
                      />
                      <label
                        htmlFor="cargo-t"
                        className="text-sm leading-tight"
                      >
                        T. U.S. Mail
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-e"
                        checked={carrierData.line24.includes("Drive/Tow away")}
                      />
                      <label
                        htmlFor="cargo-e"
                        className="text-sm leading-tight"
                      >
                        E. Drive Away/Towaway
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-m"
                        checked={carrierData.line24.includes("Passengers")}
                      />
                      <label
                        htmlFor="cargo-m"
                        className="text-sm leading-tight"
                      >
                        M. Passengers
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-u"
                        checked={carrierData.line24.includes("Chemicals")}
                      />
                      <label
                        htmlFor="cargo-u"
                        className="text-sm leading-tight"
                      >
                        U. Chemicals
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-f"
                        checked={carrierData.line24.includes(
                          "Logs, Poles, Beams, Lumber"
                        )}
                      />
                      <label
                        htmlFor="cargo-f"
                        className="text-sm leading-tight"
                      >
                        F. Logs, Poles, Beams, Lumber
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-n"
                        checked={carrierData.line24.includes(
                          "Oilfield Equipment"
                        )}
                      />
                      <label
                        htmlFor="cargo-n"
                        className="text-sm leading-tight"
                      >
                        N. Oil Field Equipment
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-v"
                        checked={carrierData.line24.includes(
                          "Commodities Dry Bulk"
                        )}
                      />
                      <label
                        htmlFor="cargo-v"
                        className="text-sm leading-tight"
                      >
                        V. Commodities Dry Bulk
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-g"
                        checked={carrierData.line24.includes(
                          "Building Materials"
                        )}
                      />
                      <label
                        htmlFor="cargo-g"
                        className="text-sm leading-tight"
                      >
                        G. Building Materials
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-o"
                        checked={carrierData.line24.includes("Livestock")}
                      />
                      <label
                        htmlFor="cargo-o"
                        className="text-sm leading-tight"
                      >
                        O. Livestock
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-w"
                        checked={carrierData.line24.includes(
                          "Refrigerated Food"
                        )}
                      />
                      <label
                        htmlFor="cargo-w"
                        className="text-sm leading-tight"
                      >
                        W. Refrigerated Food
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-h"
                        checked={carrierData.line24.includes("Mobile Homes")}
                      />
                      <label
                        htmlFor="cargo-h"
                        className="text-sm leading-tight"
                      >
                        H. Mobile Homes
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-p"
                        checked={carrierData.line24.includes(
                          "Grain, Feed, Hay"
                        )}
                      />
                      <label
                        htmlFor="cargo-p"
                        className="text-sm leading-tight"
                      >
                        P. Grain, Feed, Hay
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-x"
                        checked={carrierData.line24.includes("Beverages")}
                      />
                      <label
                        htmlFor="cargo-x"
                        className="text-sm leading-tight"
                      >
                        X. Beverages
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-y"
                        checked={carrierData.line24.includes("Paper Products")}
                      />
                      <label
                        htmlFor="cargo-y"
                        className="text-sm leading-tight"
                      >
                        Y. Paper Product
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-z"
                        checked={carrierData.line24.includes("Utilities")}
                      />
                      <label
                        htmlFor="cargo-z"
                        className="text-sm leading-tight"
                      >
                        Z. Utility
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-aa"
                        checked={carrierData.line24.includes(
                          "Agricultural/Farm Supplies"
                        )}
                      />
                      <label
                        htmlFor="cargo-aa"
                        className="text-sm leading-tight"
                      >
                        AA. Farm Supplies
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-bb"
                        checked={carrierData.line24.includes("Construction")}
                      />
                      <label
                        htmlFor="cargo-bb"
                        className="text-sm leading-tight"
                      >
                        BB. Construction
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-cc"
                        checked={carrierData.line24.includes("Water Well")}
                      />
                      <label
                        htmlFor="cargo-cc"
                        className="text-sm leading-tight"
                      >
                        CC. Water Well
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="cargo-dd"
                        checked={carrierData.line24_other.length > 0}
                      />
                      <label
                        htmlFor="cargo-dd"
                        className="text-sm leading-tight"
                      >
                        DD. Other listed below:
                      </label>
                    </div>
                    <div className="col-span-2 md:col-span-2">
                      <div className="border h-8 w-full text-sm pt-1 pl-2">
                        {carrierData.line24_other.length > 0
                          ? carrierData.line24_other
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hazardous Materials */}
                <div className="mb-6">
                  <div className="font-bold text-blue-800 mb-2">
                    25. HAZARDOUS MATERIALS (Carrier or Shipper){" "}
                    <span className="font-normal text-gray-600 italic">
                      (check all that apply)
                    </span>
                    :
                  </div>
                  <div className="text-xs mb-2">
                    (C=Carrier; S=Shipper; B=Bulk, in cargo tanks; NB=Non-Bulk,
                    in packages)
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* First column */}
                    <div>
                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="col-span-1"></div>
                        <div className="text-center">C</div>
                        <div className="text-center">S</div>
                        <div className="text-center">B</div>
                        <div className="text-center">NB</div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">A. DIV 1.1</div>
                        <div className="text-center">
                          <Checkbox id="haz-a-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-a-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-a-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-a-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">B. DIV 1.2</div>
                        <div className="text-center">
                          <Checkbox id="haz-b-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-b-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-b-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-b-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">C. DIV 1.3</div>
                        <div className="text-center">
                          <Checkbox id="haz-c-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-c-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-c-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-c-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">D. DIV 1.4</div>
                        <div className="text-center">
                          <Checkbox id="haz-d-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-d-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-d-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-d-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">E. DIV 1.5</div>
                        <div className="text-center">
                          <Checkbox id="haz-e-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-e-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-e-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-e-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">F. DIV 1.6</div>
                        <div className="text-center">
                          <Checkbox id="haz-f-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-f-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-f-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-f-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">G. DIV 2.1 (Flam. Gas)</div>
                        <div className="text-center">
                          <Checkbox id="haz-g-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-g-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-g-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-g-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">H. DIV 2.1 LPG</div>
                        <div className="text-center">
                          <Checkbox id="haz-h-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-h-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-h-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-h-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">I. DIV 2.1 (Methane)</div>
                        <div className="text-center">
                          <Checkbox id="haz-i-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-i-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-i-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-i-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">J. DIV 2.2</div>
                        <div className="text-center">
                          <Checkbox id="haz-j-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-j-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-j-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-j-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">K. DIV 2.3A</div>
                        <div className="text-center">
                          <Checkbox id="haz-k-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-k-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-k-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-k-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">L. DIV 2.3B</div>
                        <div className="text-center">
                          <Checkbox id="haz-l-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-l-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-l-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-l-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">M. DIV 2.3C</div>
                        <div className="text-center">
                          <Checkbox id="haz-m-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-m-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-m-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-m-nb" checked={false} />
                        </div>
                      </div>
                    </div>

                    {/* Second column */}
                    <div>
                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="col-span-1"></div>
                        <div className="text-center">C</div>
                        <div className="text-center">S</div>
                        <div className="text-center">B</div>
                        <div className="text-center">NB</div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">N. DIV 2.3D</div>
                        <div className="text-center">
                          <Checkbox id="haz-n-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-n-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-n-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-n-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">O. CLASS 3</div>
                        <div className="text-center">
                          <Checkbox id="haz-o-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-o-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-o-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-o-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">P. COMB LIQ</div>
                        <div className="text-center">
                          <Checkbox id="haz-p-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-p-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-p-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-p-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">Q. DIV 4.1</div>
                        <div className="text-center">
                          <Checkbox id="haz-q-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-q-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-q-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-q-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">R. DIV 4.2</div>
                        <div className="text-center">
                          <Checkbox id="haz-r-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-r-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-r-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-r-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">S. DIV 4.3</div>
                        <div className="text-center">
                          <Checkbox id="haz-s-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-s-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-s-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-s-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">T. DIV 5.1</div>
                        <div className="text-center">
                          <Checkbox id="haz-t-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-t-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-t-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-t-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">U. DIV 5.2</div>
                        <div className="text-center">
                          <Checkbox id="haz-u-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-u-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-u-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-u-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">V. DIV 6.1A</div>
                        <div className="text-center">
                          <Checkbox id="haz-v-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-v-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-v-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-v-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">W. DIV 6.1B</div>
                        <div className="text-center">
                          <Checkbox id="haz-w-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-w-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-w-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-w-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">X. DIV 6.1 LIQUID</div>
                        <div className="text-center">
                          <Checkbox id="haz-x-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-x-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-x-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-x-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">Y. DIV 6.1 SOLID</div>
                        <div className="text-center">
                          <Checkbox id="haz-y-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-y-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-y-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-y-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">
                          Z. DIV 6.2 (Infect. Substance)
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-z-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-z-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-z-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-z-nb" checked={false} />
                        </div>
                      </div>
                    </div>

                    {/* Third column */}
                    <div>
                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="col-span-1"></div>
                        <div className="text-center">C</div>
                        <div className="text-center">S</div>
                        <div className="text-center">B</div>
                        <div className="text-center">NB</div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">
                          AA. DIV 6.2 (Select Agents and Toxins)
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-aa-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-aa-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-aa-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-aa-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">BB. CLASS 7</div>
                        <div className="text-center">
                          <Checkbox id="haz-bb-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-bb-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-bb-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-bb-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">CC. HRCQ</div>
                        <div className="text-center">
                          <Checkbox id="haz-cc-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-cc-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-cc-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-cc-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">DD. CLASS 8</div>
                        <div className="text-center">
                          <Checkbox id="haz-dd-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-dd-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-dd-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-dd-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">EE. CLASS 8A</div>
                        <div className="text-center">
                          <Checkbox id="haz-ee-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-ee-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-ee-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-ee-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">FF. CLASS 8B</div>
                        <div className="text-center">
                          <Checkbox id="haz-ff-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-ff-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-ff-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-ff-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">GG. CLASS 9</div>
                        <div className="text-center">
                          <Checkbox
                            id="haz-gg-c"
                            checked={
                              carrierData.line24.includes("Motor Vehicles") ||
                              carrierData.line24.includes("Drive/Tow away")
                            }
                          />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-gg-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-gg-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox
                            id="haz-gg-nb"
                            checked={
                              carrierData.line24.includes("Motor Vehicles") ||
                              carrierData.line24.includes("Drive/Tow away")
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">HH. ELEVATED TEMP. MAT.</div>
                        <div className="text-center">
                          <Checkbox id="haz-hh-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-hh-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-hh-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-hh-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">II. INFECTIOUS WASTE</div>
                        <div className="text-center">
                          <Checkbox id="haz-ii-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-ii-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-ii-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-ii-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">JJ. MARINE POLLUTANTS</div>
                        <div className="text-center">
                          <Checkbox id="haz-jj-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-jj-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-jj-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-jj-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">KK. HAZARDOUS SUB (RQ)</div>
                        <div className="text-center">
                          <Checkbox id="haz-kk-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-kk-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-kk-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-kk-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">LL. HAZARDOUS WASTE</div>
                        <div className="text-center">
                          <Checkbox id="haz-ll-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-ll-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-ll-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-ll-nb" checked={false} />
                        </div>
                      </div>

                      <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr] mb-1">
                        <div className="text-sm">MM. LTD. QTY.</div>
                        <div className="text-center">
                          <Checkbox id="haz-mm-c" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-mm-s" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-mm-b" checked={false} />
                        </div>
                        <div className="text-center">
                          <Checkbox id="haz-mm-nb" checked={false} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="font-bold text-blue-800 mb-4">
                    26(a). NUMBER OF COMMERCIAL MOTOR VEHICLES (CMV) THAT WILL
                    BE OPERATED IN THE U.S.:
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border p-1"></th>
                          <th className="border p-1 whitespace-nowrap text-center">
                            Straight Trucks
                          </th>
                          <th className="border p-1 whitespace-nowrap text-center">
                            Truck Tractors
                          </th>
                          <th className="border p-1 whitespace-nowrap text-center">
                            Trailers
                          </th>
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
                          <th className="border p-1 whitespace-nowrap text-center">
                            Motor-coach
                          </th>
                          <th
                            className="border p-1 whitespace-nowrap text-center"
                            colSpan={9}
                          >
                            Number of vehicles carrying number of passengers{" "}
                            <span className="italic">
                              (including the driver)
                            </span>
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
                          <th
                            className="border p-1 whitespace-nowrap text-center"
                            colSpan={3}
                          >
                            School Bus
                          </th>
                          <th className="border p-1 whitespace-nowrap text-center">
                            Bus
                          </th>
                          <th
                            className="border p-1 whitespace-nowrap text-center"
                            colSpan={2}
                          >
                            Passenger Van
                          </th>
                          <th
                            className="border p-1 whitespace-nowrap text-center"
                            colSpan={3}
                          >
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
                          <th className="border p-1 whitespace-nowrap text-center">
                            1-8
                          </th>
                          <th className="border p-1 whitespace-nowrap text-center">
                            9-15
                          </th>
                          <th className="border p-1 whitespace-nowrap text-center">
                            16+
                          </th>
                          <th className="border p-1 whitespace-nowrap text-center">
                            16+
                          </th>
                          <th className="border p-1 whitespace-nowrap text-center">
                            1-8
                          </th>
                          <th className="border p-1 whitespace-nowrap text-center">
                            9-15
                          </th>
                          <th className="border p-1 whitespace-nowrap text-center">
                            1-8
                          </th>
                          <th className="border p-1 whitespace-nowrap text-center">
                            9-15
                          </th>
                          <th className="border p-1 whitespace-nowrap text-center">
                            16+
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border p-1 whitespace-nowrap text-center font-bold">
                            Owned
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.owntruck}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.owntract}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.owntrail}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.own_haz_truck}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.own_haz_trail}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.owncoach}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.ownschool_1_8}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.ownschool_9_15}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.ownschool_16}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.ownbus_16}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.ownvan_1_8}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.ownvan_9_15}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.ownlimo_1_8}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.ownlimo_9_15}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.ownlimo_16}
                              disabled
                              readOnly
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="border p-1 whitespace-nowrap text-center font-bold">
                            Term Leased
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trmtruck}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trmtract}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trmtrail}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.term_haz_truck}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.term_haz_trail}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trmcoach}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trmschool_1_8}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trmschool_9_15}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trmschool_16}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trmbus_16}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trmvan_1_8}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trmvan_9_15}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trmlimo_1_8}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trmlimo_9_15}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trmlimo_16}
                              disabled
                              readOnly
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="border p-1 whitespace-nowrap text-center font-bold">
                            Trip Leased
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trptruck}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trptract}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trptrail}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trip_haz_truck}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trip_haz_trail}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trpcoach}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trpschool_1_8}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trpschool_9_15}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trpschool_16}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trpbus_16}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trpvan_1_8}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trpvan_9_15}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trplimo_1_8}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trplimo_9_15}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-1">
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line26a.trplimo_16}
                              disabled
                              readOnly
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Non-Commercial Motor Vehicles Section */}
                <div className="mb-8">
                  <div className="font-bold text-blue-800 mb-4">
                    26(b). NUMBER OF NON-COMMERCIAL MOTOR VEHICLES (NON-CMV)
                    THAT WILL BE OPERATED IN THE U.S.:
                  </div>

                  <div className="flex justify-center">
                    <table className="border-collapse">
                      <tbody>
                        <tr>
                          <td className="border p-2 whitespace-nowrap">
                            Non-CMV
                          </td>
                          <td className="border p-2 w-32">
                            <Input
                              className="w-full h-8 border-none"
                              value={""}
                              disabled
                              readOnly
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Driver Information Section */}
                <div className="mb-8">
                  <div className="font-bold text-blue-800 whitespace-nowrap mb-4">
                    27. DRIVER INFORMATION:
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border p-2 whitespace-nowrap">
                            DRIVER INFORMATION
                          </th>
                          <th className="border p-2 whitespace-nowrap text-center">
                            INTERSTATE
                          </th>
                          <th className="border p-2 whitespace-nowrap text-center">
                            INTRASTATE
                          </th>
                          <th className="border p-2 whitespace-nowrap text-center">
                            TOTAL DRIVERS
                          </th>
                          <th className="border p-2 whitespace-nowrap text-center">
                            TOTAL CDL DRIVERS
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border p-2 whitespace-nowrap">
                            Within 100-Mile Radius
                          </td>
                          <td className="border p-2">
                            <Input
                              className="w-full h-8 border-none"
                              value={
                                carrierData.line27.interstate_within_100_miles
                              }
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-2">
                            <Input
                              className="w-full h-8 border-none"
                              value={
                                carrierData.line27.intrastate_within_100_miles
                              }
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-2" rowSpan={2}>
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line27.total_drivers}
                              disabled
                              readOnly
                            />
                          </td>
                          {/* Merged Total Drivers input, spans both rows */}
                          <td className="border p-2 align-middle" rowSpan={2}>
                            <Input
                              className="w-full h-8 border-none"
                              value={carrierData.line27.total_cdl}
                              disabled
                              readOnly
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="border p-2 whitespace-nowrap">
                            Beyond 100-Mile Radius
                          </td>
                          <td className="border p-2">
                            <Input
                              className="w-full h-8 border-none"
                              value={
                                carrierData.line27.interstate_beyond_100_miles
                              }
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="border p-2">
                            <Input
                              className="w-full h-8 border-none"
                              value={
                                carrierData.line27.intrastate_beyond_100_miles
                              }
                              disabled
                              readOnly
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* USDOT Revocation Section */}
                <div className="mb-8 border-t border-b py-4">
                  <div className="font-bold text-blue-800 mb-4">
                    28. IS YOUR USDOT NUMBER REGISTRATION CURRENTLY REVOKED BY
                    THE FMCSA?
                  </div>

                  <div className="flex items-center gap-8">
                    <RadioGroup
                      defaultValue="no"
                      className="flex gap-8"
                      disabled
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="yes" id="yes" />
                        <Label htmlFor="yes" className="whitespace-nowrap">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no" className="whitespace-nowrap">
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                    <div className="flex items-center gap-2">
                      <span className="whitespace-nowrap">
                        If yes, enter your USDOT Number:
                      </span>
                      <Input className="w-64" disabled readOnly />
                    </div>
                  </div>
                </div>

                {/* Passenger Carrier Compliance Section */}
                <div className="mb-8 border-t border-b py-4">
                  <div className="font-bold text-blue-800 mb-4">
                    29. PASSENGER CARRIER COMPLIANCE CERTIFICATION:
                  </div>

                  <div className="mb-2 font-bold">
                    ALL MOTOR PASSENGER CARRIER APPLICANTS must certify as
                    follows:
                  </div>

                  <div className="mb-4 italic">
                    <p>
                      Applicant is fit, willing, and able to provide the
                      proposed operations and to comply with all pertinent
                      statutory and regulatory requirements, including the U.S.
                      Department of Transportation's Americans with Disabilities
                      Act regulations for over-the-road bus companies located at
                      49 CFR Part 37, Subpart H, if applicable.
                    </p>
                  </div>

                  <div className="flex items-start gap-2 mb-4">
                    <Checkbox id="yes-compliance" disabled />
                    <label
                      htmlFor="yes-compliance"
                      className="text-sm font-bold"
                    >
                      YES
                    </label>
                  </div>

                  <div className="text-sm">
                    <p>
                      Private entities that are primarily in the business of
                      transporting people, whose operations affect commerce, and
                      that transport passengers in an over-the-road bus (defined
                      as a bus characterized by an elevated passenger deck over
                      a baggage compartment) are subject to the U.S. Department
                      of Transportation's Americans with Disabilities Act
                      regulations located at 49 CFR Part 37, Subpart H. For a
                      general overview of these regulations, go to the Federal
                      Motor Carrier Safety Administration's Web site at
                    </p>
                    <span className="whitespace-nowrap text-blue-500">
                      www.fmcsa.dot.gov/rules-regulations/bus/company/ada-guidelines.htm
                    </span>
                  </div>
                </div>

                {/* Officers Section */}
                <div className="mb-8">
                  <div className="font-bold text-blue-800 mb-4">
                    30. PLEASE ENTER NAME(S) OF SOLE PROPRIETOR, PARTNERS, OR
                    OFFICERS, AND TITLES
                  </div>
                  <div className="text-sm italic whitespace-nowrap mb-4">
                    (e.g., president, treasurer, general partner, limited
                    partner)
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="whitespace-nowrap">1.</span>
                        <Input className="w-full" disabled readOnly />
                      </div>
                      {/* <div className="text-center text-xs italic whitespace-nowrap">(please type or print name)</div> */}
                    </div>
                    <div>
                      <Input className="w-full" disabled readOnly />
                      {/* <div className="text-center text-xs italic whitespace-nowrap">(please type or print title)</div> */}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="whitespace-nowrap">2.</span>
                        <Input className="w-full" disabled readOnly />
                      </div>
                      <div className="text-center text-xs italic whitespace-nowrap">
                        (please type or print name)
                      </div>
                    </div>
                    <div>
                      <Input className="w-full" disabled readOnly />
                      <div className="text-center text-xs italic whitespace-nowrap">
                        (please type or print title)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certification Section */}
                <div className="mb-8">
                  <div className="font-bold text-blue-800 mb-4">
                    31. CERTIFICATION STATEMENT{" "}
                    <span className="font-normal italic">
                      (to be completed by one of the authorized company
                      officials listed in #30)
                    </span>
                    :
                  </div>

                  <div className="border border-blue-800 p-4">
                    <div className="mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">I,</span>
                        <div>
                          <Input className="w-48" disabled readOnly />
                          <div className="text-center text-xs italic whitespace-nowrap">
                            (please type or print)
                          </div>
                        </div>
                        <span className="text-sm">
                          , certify that I am familiar with the Federal Motor
                          Carrier Safety Regulations and/or Federal
                        </span>
                      </div>
                    </div>

                    <p className="mb-4 text-sm">
                      Hazardous Materials Regulations. Under penalties of
                      perjury, I declare that the information entered on this
                      report is, to the best of my knowledge and belief, true,
                      correct, and complete.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="whitespace-nowrap mb-1">Signature:</div>
                        <Input className="w-full" disabled readOnly />
                      </div>
                      <div>
                        <div className="whitespace-nowrap mb-1">Title:</div>
                        <Input className="w-full" disabled readOnly />
                        <div className="text-center text-xs italic whitespace-nowrap">
                          (please type or print)
                        </div>
                      </div>
                      <div>
                        <div className="whitespace-nowrap mb-1">Date:</div>
                        <Input className="w-full" disabled readOnly />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <Button
              onClick={handleMakeChanges}
              variant="outline"
              className="flex-1 flex items-center justify-center"
            >
              <Edit className="mr-2 h-5 w-5" />
              Make Changes
            </Button>

            <Button
              onClick={handleGeneratePDF}
              className="flex-1 bg-blue-900 hover:bg-blue-800 flex items-center justify-center"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                  Generating PDF...
                </span>
              ) : (
                <span className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Generate PDF
                </span>
              )}
            </Button>
          </div>

          {/* <ConfirmationDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
          /> */}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          &copy; 2025 FMCA Filings Generator. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
