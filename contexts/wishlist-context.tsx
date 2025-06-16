"use client";

import type React from "react";
import { createContext, useContext, useReducer, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

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

interface WishlistState {
  items: WishlistItem[];
  totalItems: number;
  isLoading: boolean;
}

type WishlistAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_WISHLIST"; payload: WishlistItem[] }
  | { type: "ADD_ITEM"; payload: WishlistItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_WISHLIST" }
  | { type: "SYNC_WITH_SERVER"; payload: WishlistItem[] };

const initialState: WishlistState = {
  items: [],
  totalItems: 0,
  isLoading: false,
};

const WishlistContext = createContext<{
  state: WishlistState;
  addToWishlist: (productId: string, variationId: string) => Promise<void>;
  removeFromWishlist: (itemId: string) => Promise<void>;
  toggleWishlistItem: (
    productId: string,
    variationId: string
  ) => Promise<boolean>;
  isInWishlist: (productId: string, variationId?: string) => boolean;
  clearWishlist: () => void;
  syncWithServer: () => Promise<void>;
} | null>(null);

function wishlistReducer(
  state: WishlistState,
  action: WishlistAction
): WishlistState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_WISHLIST":
      return {
        ...state,
        items: action.payload,
        totalItems: action.payload.length,
      };

    case "ADD_ITEM":
      const newItems = [...state.items, action.payload];
      return {
        ...state,
        items: newItems,
        totalItems: newItems.length,
      };

    case "REMOVE_ITEM":
      const filteredItems = state.items.filter(
        (item) => item._id !== action.payload
      );
      return {
        ...state,
        items: filteredItems,
        totalItems: filteredItems.length,
      };

    case "CLEAR_WISHLIST":
      return initialState;

    case "SYNC_WITH_SERVER":
      return {
        ...state,
        items: action.payload,
        totalItems: action.payload.length,
      };

    default:
      return state;
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const { data: session, status } = useSession();
  const { toast } = useToast();

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("guestWishlist");
    if (savedWishlist) {
      try {
        const wishlistItems = JSON.parse(savedWishlist);
        dispatch({ type: "SET_WISHLIST", payload: wishlistItems });
      } catch (error) {
        console.error("Error loading wishlist from localStorage:", error);
      }
    }
  }, []);

  // Sync with server when user logs in
  useEffect(() => {
    if (status === "authenticated" && state.items.length > 0) {
      syncWithServer();
    } else if (status === "authenticated") {
      loadServerWishlist();
    }
  }, [status]);

  // Save to localStorage whenever wishlist changes (for guest users)
  useEffect(() => {
    if (status !== "authenticated") {
      localStorage.setItem("guestWishlist", JSON.stringify(state.items));
    }
  }, [state.items, status]);

  const loadServerWishlist = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await fetch("/api/wishlist");
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "SYNC_WITH_SERVER", payload: data.items || [] });
      }
    } catch (error) {
      console.error("Error loading server wishlist:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const syncWithServer = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      // Merge guest wishlist with server wishlist
      for (const item of state.items) {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: item.product_id,
            variation_id: item.variation_id,
          }),
        });
      }

      // Clear guest wishlist and load server wishlist
      localStorage.removeItem("guestWishlist");
      await loadServerWishlist();
    } catch (error) {
      console.error("Error syncing wishlist with server:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const addToWishlist = async (productId: string, variationId: string) => {
    try {
      if (status === "authenticated") {
        // Add to server wishlist
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: productId,
            variation_id: variationId,
          }),
        });

        if (response.ok) {
          await loadServerWishlist();
          // toast({
          //   title: "Added to wishlist",
          //   description: "Item has been added to your wishlist",
          // });
        } else {
          throw new Error("Failed to add to wishlist");
        }
      } else {
        // Add to guest wishlist
        const productResponse = await fetch(`/api/product/${productId}`);
        const product = await productResponse.json();

        const variation = product.variations.find(
          (v: any) => v._id === variationId
        );
        if (!variation) throw new Error("Variation not found");

        const wishlistItem: WishlistItem = {
          _id: `guest-${Date.now()}-${Math.random()}`,
          product_id: productId,
          variation_id: variationId,
          added_at: new Date().toISOString(),
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
        };

        dispatch({ type: "ADD_ITEM", payload: wishlistItem });
        // toast({
        //   title: "Added to wishlist",
        //   description: "Item has been added to your wishlist",
        // });
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      // toast({
      //   title: "Error",
      //   description: "Failed to add item to wishlist",
      //   variant: "destructive",
      // });
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      if (status === "authenticated") {
        const response = await fetch(`/api/wishlist/${itemId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await loadServerWishlist();
          // toast({
          //   title: "Removed from wishlist",
          //   description: "Item has been removed from your wishlist",
          // });
        } else {
          throw new Error("Failed to remove from wishlist");
        }
      } else {
        dispatch({ type: "REMOVE_ITEM", payload: itemId });
        // toast({
        //   title: "Removed from wishlist",
        //   description: "Item has been removed from your wishlist",
        // });
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      // toast({
      //   title: "Error",
      //   description: "Failed to remove from wishlist",
      //   variant: "destructive",
      // });
    }
  };

  const toggleWishlistItem = async (
    productId: string,
    variationId: string
  ): Promise<boolean> => {
    const existingItem = state.items.find(
      (item) =>
        item.product_id === productId && item.variation_id === variationId
    );

    if (existingItem) {
      await removeFromWishlist(existingItem._id);
      return false;
    } else {
      await addToWishlist(productId, variationId);
      return true;
    }
  };

  const isInWishlist = (productId: string, variationId?: string): boolean => {
    return state.items.some(
      (item) =>
        item.product_id === productId &&
        (!variationId || item.variation_id === variationId)
    );
  };

  const clearWishlist = () => {
    dispatch({ type: "CLEAR_WISHLIST" });
    localStorage.removeItem("guestWishlist");
  };

  return (
    <WishlistContext.Provider
      value={{
        state,
        addToWishlist,
        removeFromWishlist,
        toggleWishlistItem,
        isInWishlist,
        clearWishlist,
        syncWithServer,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
