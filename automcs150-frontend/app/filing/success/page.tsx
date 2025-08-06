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
import { CheckCircle, Download, RefreshCw } from "lucide-react";
import { User } from "@/lib/types";
import { parseAccessToken } from "@/lib/parse";
import { useToast } from "@/hooks/use-toast";
import axios from "@/axios/axiosInstance";

export default function SuccessPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usdotNumber, setUsdotNumber] = useState("");
  const [filingName, setFilingName] = useState("");
  // const [filingNameTrimmed, setFilingNameTrimmed] = useState("");
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

    // Get USDOT number
    const storedUsdot = localStorage.getItem("usdotNumber");
    const storedFilingName = localStorage.getItem("filingName");
    // const storedFilingNameTrimmed = localStorage.getItem("filingNameTrimmed");

    if (!storedUsdot || !storedFilingName) {
      router.push("/filing/new");
      return;
    }

    setUsdotNumber(storedUsdot);
    setFilingName(storedFilingName);
    // setFilingNameTrimmed(storedFilingNameTrimmed);
    setUser(user);
    setIsLoading(false);
  }, [router]);

  const handleStartOver = () => {
    // Clear form data but keep authentication
    localStorage.removeItem("usdotNumber");
    localStorage.removeItem("carrierEmail");
    localStorage.removeItem("carrierMileage");
    localStorage.removeItem("carrierData");
    localStorage.removeItem("selectedChanges");
    localStorage.removeItem("filingName");
    localStorage.removeItem("filingNameTrimmed");
    localStorage.removeItem("employerNumber");

    // Navigate back to the start
    router.push("/filing/new");
  };

  const downloadPDF = async () => {
    try {
      const [response1] = await Promise.all([
        axios.get(`/filing/generated/${filingName}`, {
          responseType: "blob",
        }),
        // axios.get(`/filing/generated/${filingNameTrimmed}`, {
        //   responseType: "blob",
        // }),
      ]);

      // Download first file
      const blob1 = new Blob([response1.data], { type: "application/pdf" });
      const url1 = window.URL.createObjectURL(blob1);
      const link1 = document.createElement("a");
      link1.href = url1;
      link1.setAttribute("download", `${filingName}.pdf`);
      document.body.appendChild(link1);
      link1.click();
      link1.remove();
      window.URL.revokeObjectURL(url1);

      // Download second file
      // const blob2 = new Blob([response2.data], { type: "application/pdf" });
      // const url2 = window.URL.createObjectURL(blob2);
      // const link2 = document.createElement("a");
      // link2.href = url2;
      // link2.setAttribute("download", `${filingNameTrimmed}.pdf`);
      // document.body.appendChild(link2);
      // link2.click();
      // link2.remove();
      // window.URL.revokeObjectURL(url2);
    } catch (error) {
      console.error("Error downloading PDFs:", error);
    }
  };

  const handleDownload = () => {
    downloadPDF();

    toast({
      title: "Download Complete",
      description: "Thank you for downloading the PDF.",
      variant: "info",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-blue-900 text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-bold">FMCA Filings Generator</h1>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Success!</CardTitle>
            <CardDescription>
              Your FMCA filing has been generated successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500 mb-1">File Name</p>
              <p className="font-medium">{filingName}</p>
            </div>

            <div className="flex flex-col space-y-3">
              <Button
                className="w-full bg-blue-900 hover:bg-blue-800"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-5 w-5" />
                Download PDF
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleStartOver}
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                Start Over
              </Button>

              <Button variant="ghost" asChild className="w-full">
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          &copy; 2025 FMCA Filings Generator. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
