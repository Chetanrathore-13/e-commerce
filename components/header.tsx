"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingBag, Heart, User, MenuIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ProfileDropdown from "@/components/profile-dropdown"
import CartModal from "@/app/cart/CartModal"
import MegaMenu from "@/components/mega-menu"
import type { MegaMenuContent, CategoryWithSubcategories } from "@/types"
import { getCategoryTree, getUserWishlist } from "@/lib/api"
import { useSession } from "next-auth/react"
import AnnouncementBar from "./announcement-bar"
import { useToast } from "@/hooks/use-toast"
import logo from "@/public/Logo/Parpra.png"
import AuthPopup from "./auth-popup"

// Hardcoded mega menu content to avoid hydration issues
const defaultMegaMenuContent: Record<string, MegaMenuContent> = {
  women: {
    sections: [
      {
        title: "CATEGORIES",
        items: [
          { title: "Sarees", url: "/women/sarees" },
          { title: "Lehenga", url: "/women/lehenga" },
          { title: "Salwar Kameez", url: "/women/salwar-kameez" },
          { title: "Gowns", url: "/women/gowns" },
        ],
      },
      {
        title: "COLLECTIONS",
        items: [
          { title: "Bridal Collection", url: "/women/bridal-collection" },
          { title: "Designer Collection", url: "/women/designer-collection" },
        ],
      },
    ],
    featuredImage: "/placeholder.svg?key=qdmpt",
  },
  men: {
    sections: [
      {
        title: "STYLE",
        items: [
          { title: "Sherwanis", url: "/men/sherwanis" },
          { title: "Indo Western", url: "/men/indo-western" },
          { title: "Kurta Pyjama", url: "/men/kurta-pyjama" },
        ],
      },
      {
        title: "OCCASION",
        items: [
          { title: "Wedding Outfits", url: "/men/wedding" },
          { title: "Party Wear", url: "/men/party-wear" },
        ],
      },
    ],
    featuredImage: "/placeholder.svg?key=oc881",
  },
  sarees: {
    sections: [
      {
        title: "FABRIC",
        items: [
          { title: "Silk Sarees", url: "/women/sarees/silk" },
          { title: "Georgette Sarees", url: "/women/sarees/georgette" },
        ],
      },
      {
        title: "OCCASION",
        items: [
          { title: "Wedding Sarees", url: "/women/sarees/wedding" },
          { title: "Party Wear Sarees", url: "/women/sarees/party-wear" },
        ],
      },
    ],
    featuredImage: "/elegant-woman-in-silk-saree.png",
  },
  lehenga: {
    sections: [
      {
        title: "STYLE",
        items: [
          { title: "Bridal Lehenga", url: "/women/lehenga/bridal" },
          { title: "Designer Lehenga", url: "/women/lehenga/designer" },
        ],
      },
      {
        title: "OCCASION",
        items: [
          { title: "Wedding Lehenga", url: "/women/lehenga/wedding" },
          { title: "Reception Lehenga", url: "/women/lehenga/reception" },
        ],
      },
    ],
    featuredImage: "/placeholder.svg?key=insx1",
  },
}


// Update the Header component to fetch categories from the database
export default function Header() {
  const { status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [showAuthPopup, setAuthLoginPopup] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [megaMenuContent, setMegaMenuContent] = useState<Record<string, MegaMenuContent>>(defaultMegaMenuContent)
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const profileRef = useRef<HTMLDivElement>(null)
  const [cartItemCount, setCartItemCount] = useState(0)
  const navRef = useRef<HTMLDivElement>(null)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { toast } = useToast()

  // Fetch cart item count
  useEffect(() => {
    const fetchCartCount = async () => {
      if (status !== "authenticated") {
        setCartItemCount(0)
        return
      }

      try {
        const response = await fetch("/api/cart")
        if (!response.ok) {
          throw new Error("Failed to fetch cart")
        }

        const data = await response.json()
        // Calculate total quantity considering item quantities
        const count = data.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0
        setCartItemCount(count)
      } catch (error) {
        console.error("Error fetching cart count:", error)
        setCartItemCount(0)
      }
    }

    fetchCartCount()

    // Setup an interval to refresh the cart count every minute
    const intervalId = setInterval(fetchCartCount, 60000)

    // Clean up on component unmount
    return () => clearInterval(intervalId)
  }, [status])

  // Fetch wishlist count
  // Fetch wishlist count
  useEffect(() => {
    const fetchWishlistCount = async () => {
      if (status !== "authenticated") {
        setWishlistCount(0)
        return
      }

      try {
        const wishlistData = await getUserWishlist()
        // Make sure we're getting the correct count
        setWishlistCount(wishlistData.totalItems || wishlistData.items?.length || 0)
      } catch (error) {
        console.error("Error fetching wishlist count:", error)
        setWishlistCount(0)
      }
    }

    fetchWishlistCount()

    // Setup an interval to refresh the wishlist count every minute
    const intervalId = setInterval(fetchWishlistCount, 60000)

    // Clean up on component unmount
    return () => clearInterval(intervalId)
  }, [status])

  // Fetch categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        const categoryTree = await getCategoryTree()
        if (categoryTree && categoryTree.length > 0) {
          setCategories(categoryTree)

          // Also update mega menu content based on categories
          const newMegaMenuContent: Record<string, MegaMenuContent> = {}

          categoryTree.forEach((category) => {
            if (category.subcategories && category.subcategories.length > 0) {
              const sections = [
                {
                  title: category.name.toUpperCase(),
                  items: category.subcategories.map((sub) => ({
                    title: sub.name,
                    url: `/${category.name.toLowerCase()}/${sub.name.toLowerCase().replace(/\s+/g, "-")}`,
                  })),
                },
              ]

              newMegaMenuContent[category.name.toLowerCase()] = {
                sections,
                featuredImage: category.image || `/placeholder.svg?height=400&width=300&query=${category.name}`,
              }
            }
          })

          // Merge with default content to ensure we have fallbacks
          setMegaMenuContent((prev) => ({ ...prev, ...newMegaMenuContent }))
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Determine if we're on a women's section page
  const isWomenActive =
    pathname?.includes("/women") ||
    pathname?.includes("/sarees") ||
    pathname?.includes("/lehenga") ||
    pathname?.includes("/salwar-kameez") ||
    pathname?.includes("/gowns")

  // Fetch mega menu content
  useEffect(() => {
    const fetchMegaMenuContent = async () => {
      try {
        // Prefetch mega menu content for common categories
        const menuTypes = ["sarees", "lehenga", "salwar-kameez", "gowns", "men", "women"]

        for (const type of menuTypes) {
          try {
            const response = await fetch(`/api/mega-menu?type=${type}`)
            if (response.ok) {
              const data = await response.json()
              setMegaMenuContent((prev) => ({
                ...prev,
                [type]: data,
              }))
            }
          } catch (error) {
            console.error(`Error fetching mega menu content for ${type}:`, error)
          }
        }
      } catch (error) {
        console.error("Error fetching mega menu content:", error)
      }
    }

    fetchMegaMenuContent()
  }, [])

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }

      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMenu(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query)

    if (query.length < 2) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    setIsSearching(true)
    setShowSearchResults(true)

    try {
      const response = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=5`)
      if (!response.ok) throw new Error("Search failed")

      const data = await response.json()
      setSearchResults(data.products || [])
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // View all search results
  const viewAllSearchResults = () => {
    router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
    setShowSearchResults(false)
    setIsSearchOpen(false)
    toast({
      title: "Searching products",
      description: `Showing results for "${searchQuery}"`,
    })
  }

  // Toggle mega menu visibility
  const handleMenuMouseEnter = (menu: string) => {
    // Small delay to prevent accidental triggers
    setTimeout(() => {
      setActiveMenu(menu)
    }, 50)
  }

  // Add this function to handle mouse leave
  const handleMenuMouseLeave = () => {
    setActiveMenu(null)
  }

  // Check if a nav item is active
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname?.includes(path)
  }

  const handleOpenLoginPopup = () => {
    if (status === "unauthenticated") {
      setShowLoginPopup(true)
    } else {
      setIsProfileOpen(!isProfileOpen)
    }
  }

  const handleCloseLoginPopup = () => {
    setShowLoginPopup(false)
  }
 
 
 console.log(wishlistCount)
  return (
    <header className="sticky top-0 z-40 bg-background">
      {/* Announcement Bar */}
      <div>
        <AnnouncementBar />
      </div>
     {/* Auth Popup */}
     {showLoginPopup && <AuthPopup onClose={handleCloseLoginPopup} />}
      {/* Main Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] overflow-y-auto">
                <div className="flex flex-col h-full">
                  <div className="py-4 border-b">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                      <Image src="/parpra-logo.png" alt="PARPRA" width={120} height={40} />
                    </Link>
                  </div>

                  <div className="py-4 px-2">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full"
                    />

                    {showSearchResults && searchResults.length > 0 && (
                      <div className="mt-3">
                        <ul className="space-y-2 max-h-60 overflow-y-auto">
                          {searchResults.map((product) => (
                            <li key={product._id}>
                              <Link
                                href={`/products/${product.slug}`}
                                className="flex items-center p-2 hover:bg-gray-50 rounded"
                                onClick={() => {
                                  setShowSearchResults(false)
                                  toast({
                                    title: "Product selected",
                                    description: `Viewing ${product.name}`,
                                  })
                                }}
                              >
                                <div className="relative w-10 h-10 mr-3">
                                  <Image
                                    src={product.variations[0]?.image || "/placeholder.svg"}
                                    alt={product.name}
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium truncate">{product.name}</p>
                                  <p className="text-xs text-gray-500">
                                    ₹{product.variations[0]?.salePrice || product.variations[0]?.price}
                                  </p>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <Button variant="outline" className="w-full mt-3" onClick={viewAllSearchResults}>
                          View all results
                        </Button>
                      </div>
                    )}
                  </div>

                  <nav className="flex flex-col py-4">
                    <Link
                      href="/"
                      className={`px-2 py-3 ${
                        pathname === "/" ? "text-teal-800 font-medium" : "text-gray-700"
                      } hover:text-teal-800 border-b`}
                    >
                      Home
                    </Link>

                    {/* Dynamic Categories for Mobile */}
                    {isLoading ? (
                      // Loading placeholders
                      <div className="px-2 py-3 border-b">
                        <div className="h-5 w-20 bg-gray-200 animate-pulse rounded"></div>
                      </div>
                    ) : (
                      // Map through main categories
                      categories
                        .filter((category) => !category.parent_category_id)
                        .map((category) => (
                          <div key={category._id} className="collapsible">
                            <Link
                              href={`/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                              className={`px-2 py-3 flex justify-between items-center ${
                                isActive(`/${category.name.toLowerCase().replace(/\s+/g, "-")}`)
                                  ? "text-teal-800 font-medium"
                                  : "text-gray-700"
                              } hover:text-teal-800 border-b`}
                            >
                              {category.name}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="m6 9 6 6 6-6" />
                              </svg>
                            </Link>
                            {category.subcategories && category.subcategories.length > 0 && (
                              <div className="pl-4">
                                {category.subcategories.map((subcategory) => (
                                  <Link
                                    key={subcategory._id}
                                    href={`/${category.name.toLowerCase().replace(/\s+/g, "-")}/${subcategory.name
                                      .toLowerCase()
                                      .replace(/\s+/g, "-")}`}
                                    className={`px-2 py-2 block ${
                                      isActive(
                                        `/${category.name.toLowerCase().replace(/\s+/g, "-")}/${subcategory.name
                                          .toLowerCase()
                                          .replace(/\s+/g, "-")}`,
                                      )
                                        ? "text-teal-800 font-medium"
                                        : "text-gray-700"
                                    } hover:text-teal-800`}
                                  >
                                    {subcategory.name}
                                    {subcategory.description && (
                                      <p className="text-xs text-gray-500 mt-1">{subcategory.description}</p>
                                    )}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                    )}

                    <Link
                      href="/bridal"
                      className={`px-2 py-3 ${
                        isActive("/bridal") ? "text-teal-800 font-medium" : "text-gray-700"
                      } hover:text-teal-800 border-b`}
                    >
                      Bridal
                    </Link>
                    <Link
                      href="/collections"
                      className={`px-2 py-3 ${
                        isActive("/collections") ? "text-teal-800 font-medium" : "text-gray-700"
                      } hover:text-teal-800 border-b`}
                    >
                      Collections
                    </Link>
                    <Link
                      href="/contact"
                      className={`px-2 py-3 ${
                        isActive("/contact") ? "text-teal-800 font-medium" : "text-gray-700"
                      } hover:text-teal-800 border-b`}
                    >
                      Contact
                    </Link>

                    <div className="flex items-center mt-4 px-2">
                      <Link href="/wishlist" className="flex items-center mr-6 relative">
                        <Heart className="h-5 w-5 text-gray-700 hover:text-red-500" />
                        {wishlistCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {wishlistCount}
                          </span>
                        )}
                        <span className="ml-2">Wishlist</span>
                      </Link>

                      <button
                        className="flex items-center relative"
                        onClick={() => {
                          setIsCartOpen(true)
                          document.querySelector('[data-state="open"]')?.setAttribute("data-state", "closed")
                        }}
                      >
                        <ShoppingBag className="h-5 w-5 text-gray-700" />
                        {cartItemCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-teal-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {cartItemCount}
                          </span>
                        )}
                        <span className="ml-2">Cart</span>
                      </button>
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image src={logo} alt="PARPRA" width={100} height={60} />
            </Link>

            {/* Secondary Navigation */}
            <div className="hidden md:block overflow-x-auto relative" ref={navRef}>
              <div className="container mx-auto px-4 relative">
                <nav className="flex items-center space-x-8 py-3 whitespace-nowrap">
                  {/* Dynamic Categories */}
                  {isLoading ? (
                    // Show placeholders while loading
                    <>
                      <div className="h-5 w-20 bg-gray-200 animate-pulse rounded"></div>
                      <div className="h-5 w-20 bg-gray-200 animate-pulse rounded"></div>
                      <div className="h-5 w-20 bg-gray-200 animate-pulse rounded"></div>
                    </>
                  ) : (
                    // Map through categories from database
                    categories.map((category) => (
                      <Link
                        key={category._id}
                        href={`/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className={`text-sm hover:text-teal-800 ${
                          isActive(`/${category.name.toLowerCase().replace(/\s+/g, "-")}`)
                            ? "text-teal-800 font-medium"
                            : ""
                        }`}
                        onMouseEnter={() => handleMenuMouseEnter(category.name.toLowerCase())}
                      >
                        {category.name.toUpperCase()}
                      </Link>
                    ))
                  )}

                  <Link
                    href="/collections"
                    className={`text-sm hover:text-teal-800 ${
                      isActive("/collections") ? "text-teal-800 font-medium" : ""
                    }`}
                    onMouseEnter={() => setActiveMenu(null)}
                  >
                    COLLECTION
                  </Link>
                </nav>

                {/* Mega Menu - Now inside the navigation container */}
                {activeMenu && megaMenuContent[activeMenu] && (
                  <div
                    className="absolute left-0 right-0 top-full z-[100]"
                    onMouseEnter={() => setActiveMenu(activeMenu)}
                    onMouseLeave={handleMenuMouseLeave}
                  >
                    <MegaMenu
                      sections={megaMenuContent[activeMenu].sections}
                      featuredImage={megaMenuContent[activeMenu].featuredImage}
                      featuredImageAlt={`${activeMenu} featured image`}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative" ref={searchRef}>
                <button
                  className="hidden md:flex items-center hover:text-teal-800"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  aria-label="Search"
                >
                  <Search className="h-6 w-6" />
                </button>
              </div>

              <Link href="/wishlist" className="hidden md:flex items-center relative group" aria-label="Wishlist">
                <Heart className="h-6 w-6 group-hover:text-red-500 transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <div className="relative" ref={profileRef}>
                <button
                  className="flex items-center hover:text-teal-800"
                  onClick={handleOpenLoginPopup}
                  aria-label="User Account"
                  
                >
                  <User className="h-6 w-6" />
                </button>
                
                {isProfileOpen && status === "authenticated" && <ProfileDropdown />}
              </div>

              <button
                className="flex items-center hover:text-teal-800 relative"
                onClick={() => setIsCartOpen(true)}
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-teal-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="py-4 border-t mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-10"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  autoFocus
                />
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => {
                    setIsSearchOpen(false)
                    setSearchQuery("")
                    setShowSearchResults(false)
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {showSearchResults && searchResults.length > 0 && (
                <div className="mt-3">
                  <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {searchResults.map((product) => (
                      <li key={product._id}>
                        <Link
                          href={`/products/${product.slug}`}
                          className="flex items-center p-2 hover:bg-gray-50 rounded"
                          onClick={() => {
                            setShowSearchResults(false)
                            setIsSearchOpen(false)
                            toast({
                              title: "Product selected",
                              description: `Viewing ${product.name}`,
                            })
                          }}
                        >
                          <div className="relative w-10 h-10 mr-3">
                            <Image
                              src={product.variations[0]?.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium truncate">{product.name}</p>
                            <p className="text-xs text-gray-500">
                              ₹{product.variations[0]?.salePrice || product.variations[0]?.price}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full mt-3" onClick={viewAllSearchResults}>
                    View all results
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}
