import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { Blog } from "@/lib/models/blog"

export async function GET() {
  try {
    await connectToDatabase()

    // Get all unique categories and tags
    const [categoriesResult, tagsResult] = await Promise.all([Blog.distinct("categories"), Blog.distinct("tags")])

    // Filter out empty values
    const categories = categoriesResult.filter(Boolean)
    const tags = tagsResult.filter(Boolean)

    return NextResponse.json({ categories, tags })
  } catch (error) {
    console.error("Error fetching categories and tags:", error)
    return NextResponse.json({ error: "Failed to fetch categories and tags" }, { status: 500 })
  }
}
