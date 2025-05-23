import type { Metadata } from "next"
import { getProducts, getBrands, getCategories } from "@/lib/data"
import { ProductsTable } from "@/components/products/products-table"
import { ProductsFilter } from "@/components/products/products-filter"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, Upload } from "lucide-react"

export const metadata: Metadata = {
  title: "Products | E-commerce Admin",
  description: "Manage your store products",
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    page?: string
    per_page?: string
    name?: string
    brand_id?: string
    category_id?: string
    date?: string
  }
}) {
  const page = Number(searchParams.page) || 1
  const per_page = Number(searchParams.per_page) || 10
  const name = searchParams.name || ""
  const brand_id = searchParams.brand_id || ""
  const category_id = searchParams.category_id || ""
  const date = searchParams.date || ""

  const [{ products, totalPages }, { brands }, { categories }] = await Promise.all([
    getProducts({ page, per_page, name, brand_id, category_id, date }),
    getBrands({ page: 1, per_page: 100 }),
    getCategories({ page: 1, per_page: 100 }),
  ])

  return (
    <div className="flex-1 p-4 pt-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-5xl font-bold tracking-tight">Products</h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button asChild variant="outline" className="bg-white text-teal-600 border-teal-600 hover:bg-teal-50">
            <Link href="/dashboard/products/import-export">
              <Upload className="mr-2 h-4 w-4" />
              Import/Export
            </Link>
          </Button>
          <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
            <Link href="/dashboard/products/new">
              <PlusCircle className="mr-2 h-4 w-4 " />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      <ProductsFilter brands={brands} categories={categories} />

      <ProductsTable products={products} totalPages={totalPages} page={page} per_page={per_page} />
    </div>
  )
}
