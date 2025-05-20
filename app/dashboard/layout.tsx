import type React from "react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { ResizableSidebar } from "@/components/resizable-sidebar"
import { SidebarProvider } from "@/components/sidebar-context"
import Link from "next/link"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <MobileSidebar />
              <Link href="/dashboard" className="hidden sm:inline-block">
                <img src="/Logo/Parpra.png" alt="Logo" className="h-16 w-16" />
              </Link>
              <Link href="/dashboard"><span className="hidden font-bold sm:inline-block"> Admin Dashboard</span></Link>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <UserNav user={session.user} />
            </div>
          </div>
        </header>
        <div className="flex flex-1">
          <ResizableSidebar />
          <main className="flex w-full flex-1 flex-col overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
