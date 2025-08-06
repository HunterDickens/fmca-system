import type { Metadata } from 'next'
import { ToastProvider } from "@/components/toast-provider"
import './globals.css'
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Federal Motor Carrier Authority Online Filings PDF Generator',
  description: 'Federal Motor Carrier Authority Online Filings PDF Generator',
  generator: 'Milo Sedarat',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <ToastProvider />
      </body>
    </html>
  )
}
