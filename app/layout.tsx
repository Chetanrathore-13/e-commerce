import React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import NextAuthSessionProvider from "@/components/session-provider"
import LayoutWrapper from "@/components/layout-wrapper"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Samyakk - Ethnic Wear for Men & Women",
  description: "Discover the finest collection of ethnic wear for men and women at Samyakk.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)
  const role = session?.user?.role || "null"
  console.log(role)

  return (
    <>
      {/* This is still valid because the function itself is async */}
      {/* But make sure you are using this only in Server Component context */}
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <NextAuthSessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
              enableColorScheme={true}
            >
              {role !== "admin" && <Header />}
              <LayoutWrapper>{children}</LayoutWrapper>
              {role !== "admin" && <Footer />}
            </ThemeProvider>
          </NextAuthSessionProvider>
        </body>
      </html>
    </>
  )
}
