import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { Product, Variation, Brand, Category } from "@/lib/models"
import mongoose from "mongoose"

interface Params {
  params: Promise<{
    id: string
  }>
}

// Get product by ID (used by context for guest cart/wishlist)
export async function GET(request: Request, { params }: Params) {
  try {
    await connectToDatabase()

    const {id} = await  params
    const productId = id
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    // Find product
    const product: any = await Product.findById(productId).lean()

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Get variations
    const variations: any = await Variation.find({ product_id: productId }).lean()

    // Get brand and category details
    const brand: any = product.brand_id ? await Brand.findById(product.brand_id).lean() : null
    const category: any = product.category_id ? await Category.findById(product.category_id).lean() : null

    // Format response
    const formattedProduct = {
      _id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.description,
      short_description: product.short_description,
      sku: product.sku,
      status: product.status,
      featured: product.featured,
      meta_title: product.meta_title,
      meta_description: product.meta_description,
      tags: product.tags,
      created_at: product.created_at,
      updated_at: product.updated_at,
      brand: brand
        ? {
            _id: brand._id.toString(),
            name: brand.name,
            slug: brand.slug,
            logo: brand.logo,
          }
        : null,
      category: category
        ? {
            _id: category._id.toString(),
            name: category.name,
            slug: category.slug,
          }
        : null,
      variations: variations.map((variation:any) => ({
        _id: variation._id.toString(),
        price: variation.price,
        salePrice: variation.salePrice,
        quantity: variation.quantity,
        sku: variation.sku,
        size: variation.size,
        color: variation.color,
        weight: variation.weight,
        dimensions: variation.dimensions,
        image: variation.image,
        images: variation.images,
        status: variation.status,
      })),
    }

    return NextResponse.json(formattedProduct)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}
