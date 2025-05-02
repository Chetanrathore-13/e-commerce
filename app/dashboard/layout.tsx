import type React from "react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { DashboardNav } from "@/components/dashboard-nav"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"

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
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <MobileSidebar />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <span className="hidden font-bold sm:inline-block">E-commerce Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <UserNav user={session.user} />
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden h-[calc(100vh-4rem)] w-[240px] border-r bg-gray-50 dark:bg-gray-900 md:block">
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-auto">{children}</main>
      </div>
    </div>
  )
}
