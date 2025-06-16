"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"

interface CartItem {
  _id: string
  product_id: string
  variation_id: string
  quantity: number
  price: number
  product: {
    _id: string
    name: string
    slug: string
  }
  variation: {
    _id: string
    price: number
    salePrice?: number
    image: string
    size: string
    color: string
  }
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalQuantity: number
  subtotal: number
  isLoading: boolean
}

type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CART"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "UPDATE_ITEM"; payload: { id: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" }
  | { type: "SYNC_WITH_SERVER"; payload: CartItem[] }

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalQuantity: 0,
  subtotal: 0,
  isLoading: false,
}

const CartContext = createContext<{
  state: CartState
  addToCart: (productId: string, variationId: string, quantity?: number) => Promise<void>
  updateCartItem: (itemId: string, quantity: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  clearCart: () => void
  syncWithServer: () => Promise<void>
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "SET_CART":
      const items = action.payload
      return {
        ...state,
        items,
        totalItems: items.length,
        totalQuantity: items.reduce((total, item) => total + item.quantity, 0),
        subtotal: items.reduce(
          (total, item) => total + (item.variation.salePrice || item.variation.price) * item.quantity,
          0,
        ),
      }

    case "ADD_ITEM":
      const newItem = action.payload
      const existingItemIndex = state.items.findIndex(
        (item) => item.product_id === newItem.product_id && item.variation_id === newItem.variation_id,
      )

      let updatedItems
      if (existingItemIndex >= 0) {
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + newItem.quantity } : item,
        )
      } else {
        updatedItems = [...state.items, newItem]
      }

      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.length,
        totalQuantity: updatedItems.reduce((total, item) => total + item.quantity, 0),
        subtotal: updatedItems.reduce(
          (total, item) => total + (item.variation.salePrice || item.variation.price) * item.quantity,
          0,
        ),
      }

    case "UPDATE_ITEM":
      const updatedItemsAfterUpdate = state.items.map((item) =>
        item._id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
      )

      return {
        ...state,
        items: updatedItemsAfterUpdate,
        totalQuantity: updatedItemsAfterUpdate.reduce((total, item) => total + item.quantity, 0),
        subtotal: updatedItemsAfterUpdate.reduce(
          (total, item) => total + (item.variation.salePrice || item.variation.price) * item.quantity,
          0,
        ),
      }

    case "REMOVE_ITEM":
      const filteredItems = state.items.filter((item) => item._id !== action.payload)
      return {
        ...state,
        items: filteredItems,
        totalItems: filteredItems.length,
        totalQuantity: filteredItems.reduce((total, item) => total + item.quantity, 0),
        subtotal: filteredItems.reduce(
          (total, item) => total + (item.variation.salePrice || item.variation.price) * item.quantity,
          0,
        ),
      }

    case "CLEAR_CART":
      return initialState

    case "SYNC_WITH_SERVER":
      return {
        ...state,
        items: action.payload,
        totalItems: action.payload.length,
        totalQuantity: action.payload.reduce((total, item) => total + item.quantity, 0),
        subtotal: action.payload.reduce(
          (total, item) => total + (item.variation.salePrice || item.variation.price) * item.quantity,
          0,
        ),
      }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { data: session, status } = useSession()
  const { toast } = useToast()

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("guestCart")
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart)
        dispatch({ type: "SET_CART", payload: cartItems })
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  // Sync with server when user logs in
  useEffect(() => {
    if (status === "authenticated" && state.items.length > 0) {
      syncWithServer()
    } else if (status === "authenticated") {
      loadServerCart()
    }
  }, [status])

  // Save to localStorage whenever cart changes (for guest users)
  useEffect(() => {
    if (status !== "authenticated") {
      localStorage.setItem("guestCart", JSON.stringify(state.items))
    }
  }, [state.items, status])

  const loadServerCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await fetch("/api/cart")
      if (response.ok) {
        const data = await response.json()
        dispatch({ type: "SYNC_WITH_SERVER", payload: data.items || [] })
      }
    } catch (error) {
      console.error("Error loading server cart:", error)
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const syncWithServer = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      // Merge guest cart with server cart
      for (const item of state.items) {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: item.product_id,
            variation_id: item.variation_id,
            quantity: item.quantity,
          }),
        })
      }

      // Clear guest cart and load server cart
      localStorage.removeItem("guestCart")
      await loadServerCart()
    } catch (error) {
      console.error("Error syncing cart with server:", error)
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const addToCart = async (productId: string, variationId: string, quantity = 1) => {
    try {
      if (status === "authenticated") {
        // Add to server cart
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: productId,
            variation_id: variationId,
            quantity,
          }),
        })

        if (response.ok) {
          await loadServerCart()
          // toast({
          //   title: "Added to cart",
          //   description: "Item has been added to your cart",
          // })
        } else {
          throw new Error("Failed to add to cart")
        }
      } else {
        // Add to guest cart
        const productResponse = await fetch(`/api/product/${productId}`)
        const product = await productResponse.json()

        const variation = product.variations.find((v: any) => v._id === variationId)
        if (!variation) throw new Error("Variation not found")

        const cartItem: CartItem = {
          _id: `guest-${Date.now()}-${Math.random()}`,
          product_id: productId,
          variation_id: variationId,
          quantity,
          price: variation.salePrice || variation.price,
          product: {
            _id: product._id,
            name: product.name,
            slug: product.slug,
          },
          variation: {
            _id: variation._id,
            price: variation.price,
            salePrice: variation.salePrice,
            image: variation.image,
            size: variation.size,
            color: variation.color,
          },
        }

        dispatch({ type: "ADD_ITEM", payload: cartItem })
        // toast({
        //   title: "Added to cart",
        //   description: "Item has been added to your cart",
        // })
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      // toast({
      //   title: "Error",
      //   description: "Failed to add item to cart",
      //   variant: "destructive",
      // })
    }
  }

  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      if (status === "authenticated") {
        const response = await fetch(`/api/cart/${itemId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        })

        if (response.ok) {
          await loadServerCart()
        } else {
          throw new Error("Failed to update cart item")
        }
      } else {
        dispatch({ type: "UPDATE_ITEM", payload: { id: itemId, quantity } })
      }
    } catch (error) {
      console.error("Error updating cart item:", error)
      // toast({
      //   title: "Error",
      //   description: "Failed to update cart item",
      //   variant: "destructive",
      // })
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      if (status === "authenticated") {
        const response = await fetch(`/api/cart/${itemId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          await loadServerCart()
          // toast({
          //   title: "Item removed",
          //   description: "Item has been removed from your cart",
          // })
        } else {
          throw new Error("Failed to remove cart item")
        }
      } else {
        dispatch({ type: "REMOVE_ITEM", payload: itemId })
        // toast({
        //   title: "Item removed",
        //   description: "Item has been removed from your cart",
        // })
      }
    } catch (error) {
      console.error("Error removing cart item:", error)
      // toast({
      //   title: "Error",
      //   description: "Failed to remove cart item",
      //   variant: "destructive",
      // })
    }
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
    localStorage.removeItem("guestCart")
  }

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        syncWithServer,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
