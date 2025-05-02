import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-context" // Import AuthProvider

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Gestion des Frais Universitaires",
  description: "Application de gestion des frais universitaires",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Wrap ThemeProvider and children with AuthProvider */}
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'