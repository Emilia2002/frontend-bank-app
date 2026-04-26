// app/layout.tsx
import type React from "react"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/components/auth-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
      <AuthProvider>{children}</AuthProvider>
      </body>
      </html>
  )
}