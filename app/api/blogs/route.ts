import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { Blog } from "@/lib/models/blog"

export async function GET(request: Request) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const category = searchParams.get("category")
    const tag = searchParams.get("tag")
    const showAll = searchParams.get("showAll") === "true"

    const skip = (page - 1) * limit

    // Build query
    const query: any = {}
    if (!showAll) {
      query.published = true
    }
    if (category) {
      query.categories = category
    }
    if (tag) {
      query.tags = tag
    }

    console.log("Blog query:", query)

    const [blogs, total] = await Promise.all([
      Blog.find(query).sort({ publish_date: -1 }).skip(skip).limit(limit).lean(),
      Blog.countDocuments(query),
    ])

    console.log(`Found ${blogs.length} blogs out of ${total} total`)

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      blogs: blogs.map((blog: any) => ({
        ...blog,
        _id: blog._id.toString(),
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    })
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ error: "Failed to fetch blogs", details: (error as Error).message }, { status: 500 })
  }
}
