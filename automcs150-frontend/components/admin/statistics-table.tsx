import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function StatisticsTable() {
  const statistics = [
    {
      id: 1,
      usdot: "12345",
      company: "ABC Trucking",
      totalDownloads: 120,
      uniqueUsers: 3,
      lastDownload: "2023-06-20 14:30",
    },
    {
      id: 2,
      usdot: "67890",
      company: "XYZ Logistics",
      totalDownloads: 98,
      uniqueUsers: 2,
      lastDownload: "2023-06-19 09:15",
    },
    {
      id: 3,
      usdot: "54321",
      company: "Fast Freight Inc",
      totalDownloads: 86,
      uniqueUsers: 1,
      lastDownload: "2023-06-18 11:45",
    },
    {
      id: 4,
      usdot: "98765",
      company: "Global Transport",
      totalDownloads: 75,
      uniqueUsers: 2,
      lastDownload: "2023-06-17 16:20",
    },
    {
      id: 5,
      usdot: "13579",
      company: "Speedy Delivery",
      totalDownloads: 65,
      uniqueUsers: 1,
      lastDownload: "2023-06-16 10:30",
    },
    {
      id: 6,
      usdot: "24680",
      company: "Reliable Shipping",
      totalDownloads: 55,
      uniqueUsers: 1,
      lastDownload: "2023-06-15 13:45",
    },
    {
      id: 7,
      usdot: "11223",
      company: "Premier Cargo",
      totalDownloads: 45,
      uniqueUsers: 1,
      lastDownload: "2023-06-14 09:00",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>PDF Generation by USDOT</CardTitle>
        <CardDescription>Detailed statistics of PDF generation by USDOT number</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>USDOT</TableHead>
                {/* <TableHead>Company</TableHead> */}
                <TableHead className="text-right">Total Downloads</TableHead>
                <TableHead className="text-right">Unique Users</TableHead>
                <TableHead>Last Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statistics.map((stat) => (
                <TableRow key={stat.id}>
                  <TableCell className="font-medium">{stat.usdot}</TableCell>
                  {/* <TableCell>{stat.company}</TableCell> */}
                  <TableCell className="text-right">{stat.totalDownloads}</TableCell>
                  <TableCell className="text-right">{stat.uniqueUsers}</TableCell>
                  <TableCell>{stat.lastDownload}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
