import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { Product } from "@/lib/models"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    await connectToDatabase()

    const slug = params.slug
    console.log(`Fetching product with slug: ${slug}`)

    // Find the product by slug and populate related data
    const product = await Product.findOne({ slug })
      .populate("brand_id")
      .populate("category_id")
      .populate("variations")
      .lean()

    if (!product) {
      console.error(`Product not found for slug: ${slug}`)
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    console.log(`Found product: ${product.name}`)

    // Format response to handle ObjectId conversion
    const formattedProduct = {
      ...product,
      _id: product._id.toString(),
      brand_id: product.brand_id
        ? {
            ...product.brand_id,
            _id: product.brand_id._id.toString(),
          }
        : null,
      category_id: product.category_id
        ? {
            ...product.category_id,
            _id: product.category_id._id.toString(),
            parent_category_id: product.category_id.parent_category_id
              ? product.category_id.parent_category_id.toString()
              : null,
          }
        : null,
      variations: Array.isArray(product.variations)
        ? product.variations.map((variation: any) => ({
            ...variation,
            _id: variation._id.toString(),
            product_id: variation.product_id.toString(),
          }))
        : [],
    }

    return NextResponse.json(formattedProduct)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}
