import type React from "react"
import type { Metadata } from "next"
import { Inter, MuseoModerno as Museo_Moderno } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const museo = Museo_Moderno({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-museo",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Calibration Equipment Tracker - Thomas Jefferson University",
  description: "Radiation Therapy Equipment Calibration Tracking System",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${museo.variable} antialiased`}>
      <body className="font-sans bg-gray-50">{children}</body>
    </html>
  )
}
