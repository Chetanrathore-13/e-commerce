import type { Metadata } from "next"
import { getProductById, getVariationsByProductId } from "@/lib/data"
import { VariationsTable } from "@/components/variations-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Product Variations | E-commerce Admin",
  description: "Manage product variations",
}

export default async function ProductVariationsPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { page?: string; per_page?: string }
}) {
  const page = Number(searchParams.page) || 1
  const per_page = Number(searchParams.per_page) || 10

  const [product, { variations, totalPages }] = await Promise.all([
    getProductById(params.id),
    getVariationsByProductId(params.id, { page, per_page }),
  ])

  if (!product) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Variations for {product.name}</h2>
          <p className="text-muted-foreground">Manage product variations</p>
        </div>
        <Button asChild>
          <Link href={`/dashboard/products/${params.id}/variations/new`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Variation
          </Link>
        </Button>
      </div>
      <VariationsTable
        productId={params.id}
        variations={variations}
        totalPages={totalPages}
        page={page}
        per_page={per_page}
      />
    </div>
  )
}
