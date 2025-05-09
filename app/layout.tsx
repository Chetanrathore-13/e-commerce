import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import NextAuthSessionProvider from "@/components/session-provider"
import LayoutWrapper from "@/components/layout-wrapper"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { LoadingProvider } from "@/components/loading-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Parpra - Ethnic Wear for Men & Women",
  description: "Discover the finest collection of ethnic wear for men and women at Samyakk.",
  icons: {
    icon: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
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
            <LoadingProvider>
              <Header />
              <LayoutWrapper>{children}</LayoutWrapper>
              <Footer />
            </LoadingProvider>
          </ThemeProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}
