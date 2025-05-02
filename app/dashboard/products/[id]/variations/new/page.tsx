import type { Metadata } from "next"
import { getProductById } from "@/lib/data"
import { VariationForm } from "@/components/variation-form"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Add Variation | E-commerce Admin",
  description: "Add a new product variation",
}

export default async function NewVariationPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add Variation</h2>
          <p className="text-muted-foreground">For product: {product.name}</p>
        </div>
      </div>
      <VariationForm productId={params.id} />
    </div>
  )
}
