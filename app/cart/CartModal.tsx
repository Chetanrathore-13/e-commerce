"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Minus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  slug: string
  quantity: number
  deliveryTime: string
}

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Ochre Yellow Tissue Organza Designer Saree With Sequins Work And Readymade Blouse-GE3048",
      price: 32890,
      image: "/placeholder.svg?key=kl9l0",
      slug: "ochre-yellow-tissue-organza-designer-saree",
      quantity: 1,
      deliveryTime: "M(36) 40-45 Working Days",
    },
  ])
  const [promoCode, setPromoCode] = useState("")

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(cartItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId))
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const applyPromoCode = () => {
    // In a real implementation, this would validate the promo code with the server
    alert(`Promo code "${promoCode}" applied!`)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-medium">MY CART</h2>
          <div className="flex items-center">
            <span className="mr-4 text-gray-600">{cartItems.length} ITEMS IN YOUR CART</span>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Promo Code */}
          <div className="mb-6">
            <p className="font-medium mb-2">PROMOCODE?</p>
            <div className="flex">
              <Input
                type="text"
                placeholder="Enter coupon code here"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="rounded-r-none"
              />
              <Button
                className="rounded-l-none bg-gray-700 hover:bg-gray-800"
                onClick={applyPromoCode}
                disabled={!promoCode}
              >
                Apply
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-4">ORDER SUMMARY</h3>
            {cartItems.length === 0 ? (
              <p className="text-center py-8 text-gray-500">Your cart is empty</p>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b pb-4">
                    <div className="relative h-32 w-24 flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={onClose}
                          className="text-sm font-medium line-clamp-2 hover:text-amber-700"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                          aria-label="Remove from cart"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{item.deliveryTime}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-0.5 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-0.5 hover:bg-gray-100"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="font-medium">₹{item.price.toLocaleString("en-IN")}</p>
                      </div>
                      <button className="mt-2 text-xs text-amber-700 hover:text-amber-800 flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        Move to Wishlist
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>

          <div className="space-y-4">
            <Link href="/checkout" onClick={onClose}>
              <Button className="w-full bg-amber-700 hover:bg-amber-800">Checkout</Button>
            </Link>
            <Link href="/cart" onClick={onClose}>
              <Button variant="outline" className="w-full">
                View Cart
              </Button>
            </Link>
            <Button variant="link" onClick={onClose} className="w-full">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
