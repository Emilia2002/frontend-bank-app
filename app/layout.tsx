import type React from "react"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/components/auth-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

async function dummyServerAction() {
    "use server";
    // This is a dummy server action to ensure the app directory is treated as a server component
    return "This is a server action";
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
      <AuthProvider>{children}</AuthProvider>
      </body>
      </html>
  )
}