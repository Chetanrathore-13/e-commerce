import type { Metadata } from "next"
import { getCategories } from "@/lib/data"
import { CategoriesTable } from "@/components/categories/categories-table"
import { CategoriesFilter } from "@/components/categories/categories-filter"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Categories | E-commerce Admin",
  description: "Manage your store categories",
}

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: { page?: string; per_page?: string; name?: string; parent_id?: string }
}) {
  const page = Number(searchParams.page) || 1
  const per_page = Number(searchParams.per_page) || 10
  const name = searchParams.name || ""
  const parent_id = searchParams.parent_id || ""

  const { categories, totalPages } = await getCategories({
    page,
    per_page,
    name,
    parent_id,
  })

  // Get all categories for the parent filter dropdown
  const { categories: allCategories } = await getCategories({
    page: 1,
    per_page: 100,
  })

  return (
    <div className="flex-1 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        <Button asChild>
          <Link href="/dashboard/categories/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        </Button>
      </div>

      <CategoriesFilter parentCategories={allCategories} />

      <CategoriesTable categories={categories} totalPages={totalPages} page={page} per_page={per_page} />
    </div>
  )
}
