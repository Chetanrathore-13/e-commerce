// Client-side API functions to fetch data from the server
import type { Product, ProductListResponse, Category, CategoryWithSubcategories, Brand, MegaMenuContent } from "@/types"

// Export the getBaseUrl function so it can be used in other components
export function getBaseUrl() {
  // For server-side calls, we need an absolute URL
  if (typeof window === "undefined") {
    // Use NEXT_PUBLIC_API_URL if available, otherwise default to http://localhost:3000
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
  }

  // For client-side calls, we can use relative URLs
  return ""
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorMessage = errorData.error || `API error: ${response.status} - ${response.statusText}`
    console.error(errorMessage)
    throw new Error(errorMessage)
  }

  try {
    return await response.json()
  } catch (error) {
    console.error("Error parsing JSON response:", error)
    throw new Error("Failed to parse server response")
  }
}

// Get products with filtering, pagination, etc.
export async function getProducts(params: Record<string, any> = {}): Promise<ProductListResponse> {
  const queryParams = new URLSearchParams()

  // Add all params to query string
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString())
    }
  })

  const url = `${getBaseUrl()}/api/products?${queryParams.toString()}`

  try {
    const response = await fetch(url)
    return handleResponse<ProductListResponse>(response)
  } catch (error) {
    console.error("Error fetching products:", error)
    return { products: [], totalProducts: 0, totalPages: 0, currentPage: 1 }
  }
}

// Get a single product by slug
export async function getProductBySlug(slug: string): Promise<Product> {
  const url = `${getBaseUrl()}/api/products/${slug}`

  try {
    const response = await fetch(url)
    return handleResponse<Product>(response)
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error)
    throw error
  }
}

// Get all categories
export async function getCategories(parentId?: string): Promise<{ categories: Category[] }> {
  const queryParams = new URLSearchParams()
  if (parentId) {
    queryParams.append("parentId", parentId)
  }

  const url = `${getBaseUrl()}/api/categories?${queryParams.toString()}`

  try {
    const response = await fetch(url)
    return handleResponse<{ categories: Category[] }>(response)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return { categories: [] }
  }
}

// Get category tree (categories with subcategories)
export async function getCategoryTree(): Promise<CategoryWithSubcategories[]> {
  const url = `${getBaseUrl()}/api/categories?withSubcategories=true`

  try {
    const response = await fetch(url)
    const data = await handleResponse<{ categories: CategoryWithSubcategories[] }>(response)
    return data.categories || []
  } catch (error) {
    console.error("Error fetching category tree:", error)
    return []
  }
}

// Get all brands
export async function getBrands(): Promise<Brand[]> {
  const url = `${getBaseUrl()}/api/brands`

  try {
    const response = await fetch(url)
    return handleResponse<Brand[]>(response)
  } catch (error) {
    console.error("Error fetching brands:", error)
    return []
  }
}

// Get mega menu content
export async function getMegaMenuContent(type: string): Promise<MegaMenuContent> {
  const url = `${getBaseUrl()}/api/mega-menu?type=${type}`

  try {
    const response = await fetch(url)
    return handleResponse<MegaMenuContent>(response)
  } catch (error) {
    console.error("Error fetching mega menu content:", error)
    return {} as MegaMenuContent
  }
}

// Get banners
export async function getBanners(): Promise<any[]> {
  const url = `${getBaseUrl()}/api/banners`

  try {
    const response = await fetch(url)
    const data = await handleResponse<{ banners: any[] }>(response)
    return data.banners || []
  } catch (error) {
    console.error("Error fetching banners:", error)
    return []
  }
}

// Get testimonials
export async function getTestimonials(): Promise<any[]> {
  const url = `${getBaseUrl()}/api/testimonials`

  try {
    const response = await fetch(url)
    const data = await handleResponse<{ testimonials: any[] }>(response)
    return data.testimonials || []
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return []
  }
}

// Get homepage sections
export async function getHomepageSections(): Promise<any[]> {
  const url = `${getBaseUrl()}/api/homepage-sections`

  try {
    const response = await fetch(url)
    const data = await handleResponse<{ sections: any[] }>(response)
    return data.sections || []
  } catch (error) {
    console.error("Error fetching homepage sections:", error)
    return []
  }
}

// Get user cart
export async function getUserCart(): Promise<any> {
  const url = `${getBaseUrl()}/api/cart`

  try {
    const response = await fetch(url, {
      headers: {
        "Cache-Control": "no-cache",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Cart API error:", response.status, errorData)
      throw new Error(errorData.error || `API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching user cart:", error)
    return { items: [] }
  }
}

// Add item to cart
export async function addToCart(productId: string, variationId: string, quantity: number): Promise<any> {
  const url = `${getBaseUrl()}/api/cart`

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        variation_id: variationId,
        quantity,
      }),
    })
    return handleResponse<any>(response)
  } catch (error) {
    console.error("Error adding to cart:", error)
    throw new Error("Failed to add item to cart")
  }
}

// Update cart item
export async function updateCartItem(itemId: string, quantity: number): Promise<any> {
  const url = `${getBaseUrl()}/api/cart/${itemId}`

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity,
      }),
    })
    return handleResponse<any>(response)
  } catch (error) {
    console.error("Error updating cart item:", error)
    throw new Error("Failed to update cart item")
  }
}

// Remove cart item
export async function removeCartItem(itemId: string): Promise<any> {
  const url = `${getBaseUrl()}/api/cart/${itemId}`

  try {
    const response = await fetch(url, {
      method: "DELETE",
    })
    return handleResponse<any>(response)
  } catch (error) {
    console.error("Error removing cart item:", error)
    throw new Error("Failed to remove cart item")
  }
}

// Get user wishlist
export async function getUserWishlist(): Promise<any[]> {
  const url = `${getBaseUrl()}/api/wishlist`

  try {
    const response = await fetch(url)
    const data = await handleResponse<{ items: any[] }>(response)
    return data.items || []
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return []
  }
}

// Add item to wishlist
export async function addToWishlist(productId: string, variationId: string): Promise<any> {
  const url = `${getBaseUrl()}/api/wishlist`

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        variation_id: variationId,
      }),
    })
    return handleResponse<any>(response)
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    throw new Error("Failed to add item to wishlist")
  }
}

// Remove wishlist item
export async function removeWishlistItem(itemId: string): Promise<any> {
  const url = `${getBaseUrl()}/api/wishlist/${itemId}`

  try {
    const response = await fetch(url, {
      method: "DELETE",
    })
    return handleResponse<any>(response)
  } catch (error) {
    console.error("Error removing wishlist item:", error)
    throw new Error("Failed to remove from wishlist")
  }
}

// Get user orders
export async function getUserOrders(): Promise<any[]> {
  const url = `${getBaseUrl()}/api/orders`

  try {
    const response = await fetch(url)
    const data = await handleResponse<{ orders: any[] }>(response)
    return data.orders || []
  } catch (error) {
    console.error("Error fetching orders:", error)
    return []
  }
}

// Get order details
export async function getOrderDetails(orderId: string): Promise<any> {
  const url = `${getBaseUrl()}/api/orders/${orderId}`

  try {
    const response = await fetch(url)
    return handleResponse<any>(response)
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error)
    return null
  }
}

// Get order by ID (with option for admin mode)
export async function getOrderById(orderId: string, isAdmin = false): Promise<any> {
  const url = `${getBaseUrl()}/api/${isAdmin ? "admin/" : ""}orders/${orderId}`
   console.log(url)

  try {
    const response = await fetch(url)
    console.log("response", response)
    return handleResponse<any>(response)
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error)
    return null
  }
}

// Get admin orders with filtering, pagination, etc.
export async function getAdminOrders(params: Record<string, any> = {}): Promise<any> {
  const queryParams = new URLSearchParams()

  // Add all params to query string
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString())
    }
  })

  const url = `${getBaseUrl()}/api/admin/orders?${queryParams.toString()}`

  try {
    const response = await fetch(url)
    return handleResponse<any>(response)
  } catch (error) {
    console.error("Error fetching admin orders:", error)
    return { orders: [], totalOrders: 0, totalPages: 0, currentPage: 1 }
  }
}

// Get admin order by ID
export async function getAdminOrderById(orderId: string): Promise<any> {
  const url = `${getBaseUrl()}/api/admin/orders/${orderId}`

  try {
    const response = await fetch(url)
    return handleResponse<any>(response)
  } catch (error) {
    console.error(`Error fetching admin order ${orderId}:`, error)
    return null
  }
}

// Update order status
export async function updateOrderStatus(orderId: string, status: string, trackingNumber?: string): Promise<any> {
  const url = `${getBaseUrl()}/api/admin/orders/${orderId}`

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        ...(trackingNumber && { tracking_number: trackingNumber }),
      }),
    })
    return handleResponse<any>(response)
  } catch (error) {
    console.error(`Error updating order ${orderId} status:`, error)
    throw new Error("Failed to update order status")
  }
}

// Create order
export async function createOrder(orderData: any): Promise<any> {
  const url = `${getBaseUrl()}/api/orders`

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
    return handleResponse<any>(response)
  } catch (error) {
    console.error("Error creating order:", error)
    throw new Error("Failed to create order")
  }
}

// Get user profile
export async function getUserProfile(): Promise<any> {
  const url = `${getBaseUrl()}/api/user/profile`

  try {
    const response = await fetch(url)
    return handleResponse<any>(response)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}

// Update user profile
export async function updateUserProfile(profileData: any): Promise<any> {
  const url = `${getBaseUrl()}/api/user/profile`

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    })
    return handleResponse<any>(response)
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw new Error("Failed to update profile")
  }
}

// Update user password
export async function updateUserPassword(passwordData: any): Promise<any> {
  const url = `${getBaseUrl()}/api/user/password`

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passwordData),
    })
    return handleResponse<any>(response)
  } catch (error) {
    console.error("Error updating password:", error)
    throw new Error("Failed to update password")
  }
}

// Get collections
export async function getCollections(): Promise<any[]> {
  const url = `${getBaseUrl()}/api/collections`

  try {
    const response = await fetch(url)
    const data = await handleResponse<{ collections: any[] }>(response)
    return data.collections || []
  } catch (error) {
    console.error("Error fetching collections:", error)
    return []
  }
}

// Get collection details
export async function getCollectionBySlug(slug: string): Promise<any> {
  const url = `${getBaseUrl()}/api/collections/${slug}`

  try {
    const response = await fetch(url)
    return handleResponse<any>(response)
  } catch (error) {
    console.error(`Error fetching collection ${slug}:`, error)
    return null
  }
}

// Server-side data fetching functions with proper caching
export async function getBannersData() {
  try {
    const baseUrl = getBaseUrl()
    const res = await fetch(`${baseUrl}/api/banners`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    // Don't throw errors, just return empty data
    if (!res.ok) {
      console.error("Failed to fetch banners:", res.status)
      return { banners: [] }
    }

    return await res.json()
  } catch (error) {
    console.error("Error fetching banners:", error)
    return { banners: [] }
  }
}

export async function getHomepageSectionsData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/homepage-sections`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch homepage sections: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching homepage sections:", error)
    return { sections: [] }
  }
}

export async function getTestimonialsData() {
  try {
    const baseUrl = getBaseUrl()
    const res = await fetch(`${baseUrl}/api/testimonials`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    // Don't throw errors, just return empty data
    if (!res.ok) {
      console.error("Failed to fetch testimonials:", res.status)
      return { testimonials: [] }
    }

    return await res.json()
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return { testimonials: [] }
  }
}

export async function getCategoriesData() {
  try {
    const baseUrl = getBaseUrl()
    const res = await fetch(`${baseUrl}/api/categories`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    // Don't throw errors, just return empty data
    if (!res.ok) {
      console.error("Failed to fetch categories:", res.status)
      return { categories: [] }
    }

    return await res.json()
  } catch (error) {
    console.error("Error fetching categories:", error)
    return { categories: [] }
  }
}

export async function getProductsData(params = {}) {
  const queryParams = new URLSearchParams()

  // Add any parameters to the query string
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString())
    }
  })

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ""

  try {
    const baseUrl = getBaseUrl()
    const res = await fetch(`${baseUrl}/api/products${queryString}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    // Don't throw errors, just return empty data
    if (!res.ok) {
      console.error("Failed to fetch products:", res.status)
      return { products: [], total: 0 }
    }

    return await res.json()
  } catch (error) {
    console.error("Error fetching products:", error)
    return { products: [], total: 0 }
  }
}

export async function getProductData(slug: string) {
  try {
    const baseUrl = getBaseUrl()
    const res = await fetch(`${baseUrl}/api/products/${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    // Don't throw errors, just return empty data
    if (!res.ok) {
      console.error(`Failed to fetch product ${slug}:`, res.status)
      return null
    }

    return await res.json()
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error)
    return null
  }
}

export async function getNavbarCategories() {
  try {
    const response = await fetch(`/api/categories?navbar=true`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error("Failed to fetch navbar categories")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching navbar categories:", error)
    return []
  }
}
