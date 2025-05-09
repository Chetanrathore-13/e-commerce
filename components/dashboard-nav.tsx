"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Layers, LayoutDashboard, Package, Tag , Users} from "lucide-react"
import { Separator } from "@/components/ui/separator"

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/dashboard/categories",
    icon: Layers,
  },
  {
    title: "Brands",
    href: "/dashboard/brands",
    icon: Tag,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Homepage Sections",
    href: "/dashboard/homepage",
    icon: Tag,
  },
  {
    title: "Testimonials",
    href: "/dashboard/testimonials",
    icon: Tag,
  },
  {
    title:"Orders",
    href: "/dashboard/orders",
    icon: Tag,
  },
  {
    title:"Blogs",
    href: "/dashboard/blogs",
    icon: Tag,
  },
  {
    title:"Coupons",
    href: "/dashboard/coupons",
    icon: Tag,
  },
  {
    title:"Announcement Bar",
    href: "/dashboard/announcements",
    icon: Tag,
  }
]

interface DashboardNavProps {
  setOpen?: (open: boolean) => void
}

export function DashboardNav({ setOpen }: DashboardNavProps) {
  const pathname = usePathname()

  return (
    <nav className="h-full py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Navigation</h2>
        <div className="space-y-1">
          {items.map((item, index) => (
            <div key={item.href} className="flex flex-col">
              <Link
                href={item.href}
                onClick={() => {
                  if (setOpen) setOpen(false)
                }}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </Link>
              {index < items.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
}
