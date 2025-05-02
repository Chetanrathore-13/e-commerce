"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Edit, Trash2, Layers, Star, Award } from "lucide-react"
import type { IProduct } from "@/lib/models"
import { Pagination } from "@/components/pagination"

interface ProductsTableProps {
  products: IProduct[]
  totalPages: number
  page: number
  per_page: number
}

export function ProductsTable({ products, totalPages, page, per_page }: ProductsTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setIsDeleting(id)

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete product")
      }

      toast({
        title: "Success",
        description: "Product deleted successfully",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete product",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const toggleStatus = async (id: string, field: "is_featured" | "is_best_seller", currentValue: boolean) => {
    setIsUpdating(id)

    try {
      // Get the current product data
      const getResponse = await fetch(`/api/products/${id}`)
      const { product } = await getResponse.json()

      if (!getResponse.ok) {
        throw new Error("Failed to get product data")
      }

      // Update the status
      const updateData = {
        ...product,
        [field]: !currentValue,
      }

      const updateResponse = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      const data = await updateResponse.json()

      if (!updateResponse.ok) {
        throw new Error(data.error || `Failed to update product ${field}`)
      }

      toast({
        title: "Success",
        description: `Product ${field.replace("is_", "")} status updated`,
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update product",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="w-[180px]">Created At</TableHead>
              <TableHead className="text-right w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product._id.toString()}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    {/* @ts-ignore - brand_id is populated */}
                    {product.brand_id?.name || "Unknown"}
                  </TableCell>
                  <TableCell>
                    {/* @ts-ignore - category_id is populated */}
                    {product.category_id?.name || "Unknown"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={product.is_featured ? "text-yellow-500" : "text-muted-foreground"}
                        onClick={() => toggleStatus(product._id.toString(), "is_featured", product.is_featured)}
                        disabled={isUpdating === product._id.toString()}
                        title={product.is_featured ? "Remove from featured" : "Add to featured"}
                      >
                        <Star className="h-5 w-5" fill={product.is_featured ? "currentColor" : "none"} />
                        <span className="sr-only">
                          {product.is_featured ? "Remove from featured" : "Add to featured"}
                        </span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className={product.is_best_seller ? "text-green-500" : "text-muted-foreground"}
                        onClick={() => toggleStatus(product._id.toString(), "is_best_seller", product.is_best_seller)}
                        disabled={isUpdating === product._id.toString()}
                        title={product.is_best_seller ? "Remove from best sellers" : "Add to best sellers"}
                      >
                        <Award className="h-5 w-5" fill={product.is_best_seller ? "currentColor" : "none"} />
                        <span className="sr-only">
                          {product.is_best_seller ? "Remove from best sellers" : "Add to best sellers"}
                        </span>
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/products/${product._id}/variations`}>
                          <Layers className="h-4 w-4" />
                          <span className="sr-only">Variations</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/products/${product._id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the product and all its variations. This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(product._id.toString())}
                              disabled={isDeleting === product._id.toString()}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {isDeleting === product._id.toString() ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination totalPages={totalPages} currentPage={page} />
    </div>
  )
}
