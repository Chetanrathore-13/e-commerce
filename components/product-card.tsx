import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  if (!product) return null

  // Get the first variation for display
  const variation = product.variations && product.variations.length > 0 ? product.variations[0] : null

  // Safely extract price and salePrice
  const price = variation?.price || 0
  const salePrice = variation?.salePrice
  const hasDiscount = salePrice && salePrice < price

  // Calculate discount percentage if there's a sale price
  const discountPercentage = hasDiscount ? Math.round(((price - salePrice) / price) * 100) : 0

  return (
    <div className="group relative">
      <div className="aspect-[3/4] w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
        <Link href={`/products/${product.slug}`}>
          {variation?.image ? (
            <Image
              src={variation.image || "/placeholder.svg"}
              alt={product.name}
              width={500}
              height={600}
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </Link>

        {/* Wishlist button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
        >
          <Heart className="h-4 w-4" />
          <span className="sr-only">Add to wishlist</span>
        </Button>

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.is_best_seller && <Badge className="bg-teal-700 hover:bg-teal-800">Best Seller</Badge>}
          {product.is_featured && (
            <Badge variant="outline" className="bg-white text-teal-700 border-teal-700">
              Featured
            </Badge>
          )}
          {hasDiscount && <Badge variant="destructive">-{discountPercentage}%</Badge>}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-900">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="mt-1 text-sm text-gray-500">{product.brand_id?.name || "Unknown Brand"}</p>
        <div className="mt-2">
          {hasDiscount ? (
            <>
              <span className="text-sm font-medium text-gray-900">₹{salePrice?.toLocaleString() || "0"}</span>
              <span className="ml-2 text-sm text-gray-500 line-through">₹{price?.toLocaleString() || "0"}</span>
            </>
          ) : (
            <span className="text-sm font-medium text-gray-900">₹{price?.toLocaleString() || "0"}</span>
          )}
        </div>
      </div>
    </div>
  )
}
