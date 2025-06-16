"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X, Heart, ShoppingBag, ArrowLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import UserAccountSidebar from "@/components/user-account-sidebar";
import { useWishlist } from "@/contexts/wishlist-context";
import { useCart } from "@/contexts/cart-context";
import { useSession } from "next-auth/react";

interface WishlistItem {
  _id: string;
  product_id: string;
  variation_id: string;
  added_at: string;
  product: {
    _id: string;
    name: string;
    slug: string;
  };
  variation: {
    _id: string;
    price: number;
    salePrice?: number;
    image: string;
    size: string;
    color: string;
  };
}

export default function WishlistPage() {
  const { status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  // const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { state: wishlistState, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set loading to false after a short delay to show the current state
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleRemoveFromWishlist = async (
    itemId: string,
    productName: string
  ) => {
    try {
      await removeFromWishlist(itemId);
      toast({
        title: "Item removed",
        description: `${productName} has been removed from your wishlist.`,
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast({
        variant: "destructive",
        title: "Removal failed",
        description:
          "We couldn't remove this item from your wishlist. Please try again.",
      });
    }
  };

  const handleAddToCart = async (
    productId: string,
    variationId: string,
    productName: string
  ) => {
    try {
      await addToCart(productId, variationId, 1);
      toast({
        title: "Added to cart",
        description: `${productName} has been added to your cart.`,
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/cart")}
            className="h-8 px-3 text-xs"
          >
            View Cart
          </Button>
        ),
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        variant: "destructive",
        title: "Couldn't add to cart",
        description:
          "We couldn't add this item to your cart. Please try again.",
      });
    }
  };

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="bg-neutral-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <Skeleton className="h-[400px] w-full rounded-md" />
            </div>
            <div className="flex-1">
              <Skeleton className="h-12 w-1/3 mb-6" />
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col md:flex-row gap-6 border-b pb-8"
                  >
                    <Skeleton className="h-[200px] w-full md:w-1/4 rounded-md" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-10 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-5 sm:py-8 md:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <UserAccountSidebar activeItem="wishlist" />
          </div>

          {/* Main Content */}
          {/* Wishlist Content */}
          {wishlistState.totalItems === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Heart className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Save items you love by clicking the heart icon on any product. We'll keep them safe here for you.
              </p>
              <Link href="/products">
                <Button className="bg-amber-700 hover:bg-amber-800 px-8">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistState.items.map((item) => {
                const price = item.variation.salePrice || item.variation.price
                const originalPrice = item.variation.price
                const hasDiscount = item.variation.salePrice && item.variation.salePrice < item.variation.price

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Link href={`/products/${item.product.slug}`}>
                        <Image
                          src={item.variation.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveFromWishlist(item._id, item.product.name)}
                        className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <X className="h-4 w-4 text-gray-600" />
                      </button>

                      {/* Discount Badge */}
                      {hasDiscount && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                          {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="block hover:text-amber-700 transition-colors"
                      >
                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{item.product.name}</h3>
                      </Link>

                      <div className="text-sm text-gray-500 mb-3">
                        <span>Size: {item.variation.size}</span>
                        <span className="mx-2">•</span>
                        <span>Color: {item.variation.color}</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center mb-4">
                        <span className="text-lg font-semibold text-gray-900">₹{price.toLocaleString("en-IN")}</span>
                        {hasDiscount && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ₹{originalPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <Button
                        onClick={() => handleAddToCart(item.product_id, item.variation_id, item.product.name)}
                        className="w-full bg-amber-700 hover:bg-amber-800 text-white"
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
