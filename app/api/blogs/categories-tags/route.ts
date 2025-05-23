import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { Blog } from "@/lib/models/blog"

export async function GET() {
  try {
    await connectToDatabase()

    // Get all unique categories and tags
    const [categoriesResult, tagsResult] = await Promise.all([
      Blog.distinct("categories").exec(),
      Blog.distinct("tags").exec(),
    ])

    // Filter out empty values and flatten arrays
    const categories = categoriesResult
      .flat()
      .filter(Boolean)
      .filter((category: any) => typeof category === "string" && category.trim() !== "")

    const tags = tagsResult
      .flat()
      .filter(Boolean)
      .filter((tag: any) => typeof tag === "string" && tag.trim() !== "")

    console.log(`Found ${categories.length} categories and ${tags.length} tags`)

    return NextResponse.json({ categories, tags })
  } catch (error) {
    console.error("Error fetching categories and tags:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories and tags", details: (error as Error).message },
      { status: 500 },
    )
  }
}
