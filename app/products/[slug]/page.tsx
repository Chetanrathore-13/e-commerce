import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import ProductDetailClient from "./product-detail-client"

async function getProduct(slug: string) {

  try {
    // Use absolute URL to avoid path issues
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
   
    const res = await fetch(`${baseUrl}/api/products/${slug}`, {
      cache: "no-store", // Disable cache to always get fresh data
    })
    

    if (!res.ok) {
      console.error(`Failed to fetch product: ${res.status} ${res.statusText}`)
      if (res.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch product: ${res.status}`)
    }

    return await res.json()
  } catch (error) {
    console.error("Error loading product:", error)
    return null
  }
}

async function getRelatedProducts(categoryId: string, productId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/products?category=${categoryId}&exclude=${productId}&limit=4`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Failed to fetch related products")
    }

    const data = await res.json()
    return { relatedProducts: data.products || [] }
  } catch (error) {
    console.error("Error loading related products:", error)
    return { relatedProducts: [] }
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)

  if (!product) {
    console.error(`Product not found for slug: ${params.slug}`)
    notFound()
  }

  

  // Get related products based on category if available
  const categoryId = product.category_id?._id || product.category_id
  const { relatedProducts = [] } = categoryId
    ? await getRelatedProducts(categoryId, product._id)
    : { relatedProducts: [] }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4 ml-5">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-md text-gray-900 hover:text-amber-700">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link href="/products" className="text-md text-gray-900 hover:text-amber-700">
                  Products
                </Link>
              </div>
            </li>
            {product.category_id && (
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <Link
                    href={`/${product.category_id.name?.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-md text-gray-900 hover:text-amber-700"
                  >
                    {product.category_id.name || "Category"}
                  </Link>
                </div>
              </li>
            )}
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-md text-gray-900">{product.name}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailClient product={product} />
      </Suspense>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 mb-5">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct: any) => (
              <Link href={`/products/${relatedProduct.slug}`} key={relatedProduct._id} className="group">
                <div className="relative h-90 overflow-hidden rounded-lg bg-gray-100">
                  {relatedProduct.variations && relatedProduct.variations[0]?.image ? (
                    <Image
                      src={fixImagePath(relatedProduct.variations[0].image) || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <h3 className="text-md   font-medium text-gray-900">{relatedProduct.name}</h3>
                  <p className="text-md text-teal-700 mt-1">
                    ₹{(relatedProduct.variations?.[0]?.price || 0).toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to fix image paths
function fixImagePath(path: string) {
  if (!path) return "/diverse-products-still-life.png"

  // If it's already a full URL or starts with /, return as is
  if (path.startsWith("http") || path.startsWith("/")) {
    return path
  }

  // Otherwise, add /uploads/ prefix
  return `/uploads/${path}`
}

function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Skeleton className="h-96 w-full rounded-lg" />
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/3" />
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-10 rounded-full" />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/3" />
          <div className="flex space-x-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-16 rounded-md" />
            ))}
          </div>
        </div>
        <div className="flex space-x-4">
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-12 w-12" />
        </div>
      </div>
    </div>
  )
}
