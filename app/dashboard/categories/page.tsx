import type { Metadata } from "next"
import { getCategories } from "@/lib/data"
import { CategoriesTable } from "@/components/categories-table"
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
  searchParams: { page?: string; per_page?: string }
}) {
  const page = Number(searchParams.page) || 1
  const per_page = Number(searchParams.per_page) || 10

  const { categories, totalPages } = await getCategories({ page, per_page })

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        <Button asChild>
          <Link href="/dashboard/categories/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        </Button>
      </div>
      <CategoriesTable categories={categories} totalPages={totalPages} page={page} per_page={per_page} />
    </div>
  )
}
