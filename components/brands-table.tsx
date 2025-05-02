"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
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
import { Edit, Trash2 } from "lucide-react"
import type { IBrand } from "@/lib/models"
import { Pagination } from "@/components/pagination"

interface BrandsTableProps {
  brands: IBrand[]
  totalPages: number
  page: number
  per_page: number
}

export function BrandsTable({ brands, totalPages, page, per_page }: BrandsTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setIsDeleting(id)

    try {
      const response = await fetch(`/api/brands/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete brand")
      }

      toast({
        title: "Success",
        description: "Brand deleted successfully",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete brand",
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
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-[180px]">Created At</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No brands found.
                </TableCell>
              </TableRow>
            ) : (
              brands.map((brand) => (
                <TableRow key={brand._id.toString()}>
                  <TableCell>
                    {brand.image ? (
                      <Image
                        src={brand.image || "/placeholder.svg"}
                        alt={brand.name}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                        No img
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{brand.name}</TableCell>
                  <TableCell>{new Date(brand.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/brands/${brand._id}`}>
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
                              This will permanently delete the brand. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(brand._id.toString())}
                              disabled={isDeleting === brand._id.toString()}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {isDeleting === brand._id.toString() ? "Deleting..." : "Delete"}
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
