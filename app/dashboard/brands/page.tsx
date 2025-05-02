import type { Metadata } from "next"
import { getBrands } from "@/lib/data"
import { BrandsTable } from "@/components/brands-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Brands | E-commerce Admin",
  description: "Manage your store brands",
}

export default async function BrandsPage({
  searchParams,
}: {
  searchParams: { page?: string; per_page?: string }
}) {
  const page = Number(searchParams.page) || 1
  const per_page = Number(searchParams.per_page) || 10

  const { brands, totalPages } = await getBrands({ page, per_page })

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Brands</h2>
        <Button asChild>
          <Link href="/dashboard/brands/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Brand
          </Link>
        </Button>
      </div>
      <BrandsTable brands={brands} totalPages={totalPages} page={page} per_page={per_page} />
    </div>
  )
}
