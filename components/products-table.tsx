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
import { Edit, Trash2, Layers } from "lucide-react"
import type { IProduct } from "@/lib/models"
import { Pagination } from "@/components/pagination"
import { Badge } from "@/components/ui/badge"

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

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
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
                    <div className="flex flex-wrap gap-1">
                      {product.is_featured && (
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        >
                          Featured
                        </Badge>
                      )}
                      {product.is_best_seller && (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        >
                          Best Seller
                        </Badge>
                      )}
                      {!product.is_featured && !product.is_best_seller && <Badge variant="outline">Regular</Badge>}
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
