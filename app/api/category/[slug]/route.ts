import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { Category } from "@/lib/models"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    await connectToDatabase()

    // Convert slug to a potential category name
    const slug = params.slug
    const possibleName = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    // Try to find by name (case insensitive)
    const category = await Category.findOne({
      name: { $regex: new RegExp(`^${possibleName}$`, "i") },
    }).lean()

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...category,
      _id: category._id.toString(),
      parent_category_id: category.parent_category_id ? category.parent_category_id.toString() : null,
    })
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
  }
}
