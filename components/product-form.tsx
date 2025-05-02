"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import type { IBrand, ICategory, IProduct } from "@/lib/models"

const formSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  brand_id: z.string().min(1, "Brand is required"),
  category_id: z.string().min(1, "Category is required"),
  material: z.string().optional(),
  tags: z.string().optional(),
  is_featured: z.boolean().default(false),
  is_best_seller: z.boolean().default(false),
})

interface ProductFormProps {
  product?: IProduct
  brands: IBrand[]
  categories: ICategory[]
}

export function ProductForm({ product, brands, categories }: ProductFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      brand_id: product?.brand_id.toString() || "",
      category_id: product?.category_id.toString() || "",
      material: product?.material || "",
      tags: product?.tags ? product.tags.join(", ") : "",
      is_featured: product?.is_featured || false,
      is_best_seller: product?.is_best_seller || false,
    },
  })
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    
    try {
      // Process tags
      const tags = values.tags
        ? values.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : []
      
      const productData = {
        ...values,
        tags,
      }
      
      if (product) {
        const response = await fetch(`/api/products/${product._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        })
        
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to update product")
        }
        
        toast({
          title: "Success",
          description: "Product updated successfully",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
