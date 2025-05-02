import type { Metadata } from "next"
import { getProductById, getVariationById } from "@/lib/data"
import { VariationForm } from "@/components/variations/variation-form"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Edit Variation | E-commerce Admin",
  description: "Edit a product variation",
}

export default async function EditVariationPage({
  params,
}: {
  params: { id: string; variationId: string }
}) {
  const [product, variation] = await Promise.all([getProductById(params.id), getVariationById(params.variationId)])

  if (!product || !variation) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Variation</h2>
          <p className="text-muted-foreground">For product: {product.name}</p>
        </div>
      </div>
      <VariationForm productId={params.id} variation={variation} />
    </div>
  )
}
