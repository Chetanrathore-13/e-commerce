import type { Metadata } from "next"
import { CategoryForm } from "@/components/category-form"
import { getCategories } from "@/lib/data"

export const metadata: Metadata = {
  title: "Add Category | E-commerce Admin",
  description: "Add a new category to your store",
}

export default async function NewCategoryPage() {
  const { categories } = await getCategories({ page: 1, per_page: 100 })

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Add Category</h2>
      </div>
      <CategoryForm parentCategories={categories} />
    </div>
  )
}
