import Link from "next/link"
import { User, Package, Heart, MapPin, CreditCard, LogOut } from "lucide-react"

interface UserAccountSidebarProps {
  activeItem: "profile" | "orders" | "wishlist" | "addresses" | "payment-methods"
}

export default function UserAccountSidebar({ activeItem }: UserAccountSidebarProps) {
  const menuItems = [
    {
      name: "Profile",
      href: "/account/profile",
      icon: <User className="h-5 w-5" />,
      id: "profile",
    },
    {
      name: "Orders",
      href: "/account/orders",
      icon: <Package className="h-5 w-5" />,
      id: "orders",
    },
    {
      name: "Wishlist",
      href: "/wishlist",
      icon: <Heart className="h-5 w-5" />,
      id: "wishlist",
    },
    {
      name: "Addresses",
      href: "/account/addresses",
      icon: <MapPin className="h-5 w-5" />,
      id: "addresses",
    },
    {
      name: "Payment Methods",
      href: "/account/payment-methods",
      icon: <CreditCard className="h-5 w-5" />,
      id: "payment-methods",
    },
  ]

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-medium">My Account</h2>
      </div>
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-md ${
                  activeItem === item.id ? "bg-amber-50 text-amber-700" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/logout" className="flex items-center px-4 py-3 rounded-md text-gray-700 hover:bg-gray-100">
              <span className="mr-3">
                <LogOut className="h-5 w-5" />
              </span>
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
