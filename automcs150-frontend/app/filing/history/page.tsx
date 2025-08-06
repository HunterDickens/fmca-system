"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, FileText, Search, FileDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { User } from "@/lib/types"
import { parseAccessToken } from "@/lib/parse"
import axios from "@/axios/axiosInstance"
import moment from "moment"
import Header from "@/app/header"
import { GenericPaginatedTable, type ColumnDef } from "@/components/ui/generic-paginated-table"
import { FilingHistory } from "@/lib/types"

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function HistoryPage() {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filingHistory, setFilingHistory] = useState<FilingHistory[]>([])
  const router = useRouter()

  const fetchFilingHistories = async () => {
    await axios.get("/filing/get_filing_history").then((response) => {
      if (response.status === 200) {
        setFilingHistory(response.data.filing_histories)
      }
    })
  }

  useEffect(() => {
    // Check if user is authenticated
    const accessToken = localStorage.getItem("accessToken") || ''
    const user = parseAccessToken(accessToken);
    if (!user) {
      router.push("/login")
      return
    }

    fetchFilingHistories()

    // In a real app, this would fetch filing history from an API
    // For demo purposes, we'll use mock data

    /* const mockHistory: FilingHistory[] = [
      {
        id: "filing-001",
        usdotNumber: "1234567",
        carrierEmail: "milo@fmcafilings.com",
        carrierMileage: 5031,
        carrierEin: "",
        filingPath: "",
        status: "completed",
        created_at: "2024-04-01"
      },
      {
        id: "filing-002",
        usdotNumber: "7654321",
        carrierEmail: "milo@fmcafilings.com",
        carrierMileage: 14000,
        carrierEin: "",
        filingPath: "",
        status: "completed",
        created_at: "2024-03-28"
      },
      {
        id: "filing-003",
        usdotNumber: "9876543",
        carrierEmail: "milo@fmcafilings.com",
        carrierMileage: 19334,
        carrierEin: "",
        filingPath: "",
        status: "completed",
        created_at: "2024-03-25",
      },
      {
        id: "filing-004",
        usdotNumber: "5555555",
        carrierEmail: "milo@fmcafilings.com",
        carrierMileage: 125,
        carrierEin: "",
        filingPath: "",
        status: "completed",
        created_at: "2024-03-20",
      },
      {
        id: "filing-005",
        usdotNumber: "8888888",
        carrierEmail: "milo@fmcafilings.com",
        carrierMileage: 90012,
        carrierEin: "",
        filingPath: "",
        status: "completed",
        created_at: "2024-03-15",
      },
    ] */
    setUser(user)
    setIsLoading(false)
  }, [router])

  const filteredHistory = filingHistory.filter(
    (filing) =>
      filing.usdotNumber.includes(searchTerm) || filing.carrierEmail.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleView = async (filingPath: string) => {
    try {
      await axios.head(`/filing/generated/${filingPath}`);
      window.open(`${process.env.NEXT_PUBLIC_BACKEND_URL}/filing/generated/${filingPath}`, '_blank');
    } catch (error) {
      toast({
        title: "Not Found",
        description: "This file does not exist.",
        variant: "destructive",
      })
    }
  }

  const handleDownload = async (filingPath: string) => {
    await axios.get(`/filing/generated/${filingPath}`, {
      responseType: 'blob',
    }).then((response) => {
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filingPath); // Force download with a custom name
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }).catch((error) => {
      toast({
        title: "Download failed",
        description: "A download file is not available.",
        variant: "destructive",
      })
    });
  }

  const handleExport = async () => {
    await axios.get("/filing/export_history", {
      responseType: 'blob'
    }).then((response) => {
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Filing-history-${moment().format("YYYYMMDDHHmmss")}.csv`); // Change filename as needed
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }).catch((error) => {
      toast({
        title: "Export failed",
        description: "An error occurred during export.",
        variant: "destructive",
      })
    })
  }

  const columns: ColumnDef<FilingHistory>[] = [
    {
      header: "USDOT Number",
      accessorKey: "usdotNumber",
      className: "font-medium",
    },
    {
      header: "Carrier Email",
      accessorKey: "carrierEmail",
    },
    {
      header: "Carrier Mileage",
      accessorKey: "carrierMileage",
    },
    {
      header: "EIN",
      accessorKey: "carrierEin",
    },
    {
      header: "Date",
      cell: (filing) => formatDate(filing.created_at),
    },
    {
      header: "Status",
      cell: (filing) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${filing.status === 1 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
            }`}
        >
          {filing.status === 1 ? "Completed" : "Pending"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (filing) => (
        <div className="flex justify-end space-x-1">
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleDownload(filing.filingPath)}>
            <span className="sr-only">Download</span>
            <Download className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleView(filing.filingPath)}>
            <span className="sr-only">View</span>
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: "text-right",
    },
  ]

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

      <div className="container mx-auto px-4 py-4">
        <Link href="/dashboard" className="inline-flex items-center text-blue-900 hover:text-blue-700">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <main className="flex-grow container mx-auto px-4 py-4">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">Filing History</CardTitle>
                <CardDescription>View and download your previous FMCA filings</CardDescription>
              </div>
              <div className="flex flex-row gap-4">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search by USDOT or name"
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button onClick={handleExport}>
                  <FileDown className="w-5 h-5" />
                  Export History
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredHistory.length > 0 ? (
              <GenericPaginatedTable data={filingHistory} columns={columns} keyExtractor={(filing) => filing.id}
                emptyMessage="No filings found" />
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No filings found</h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "No filings match your search criteria. Try a different search term."
                    : "You haven't created any filings yet."}
                </p>
              </div>
            )}
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

