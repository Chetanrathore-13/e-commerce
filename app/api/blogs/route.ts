import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import {Blog} from "@/lib/models/blog"

export async function GET(request: Request) {
  try {
    console.log("Fetching blogs from API...")
    await connectToDatabase()
    console.log("Database connected successfully")

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const category = searchParams.get("category")
    const tag = searchParams.get("tag")
    const showAll = searchParams.get("showAll") === "true"

    const skip = (page - 1) * limit

    // Build query - for public blog page, show all blogs regardless of published status for now
    const query: any = {}

    if (category) {
      query.categories = { $in: [category] }
    }
    if (tag) {
      query.tags = { $in: [tag] }
    }

    console.log("Blog query:", JSON.stringify(query))

    // Get total count first
    const total = await Blog.countDocuments(query)
    console.log(`Total blogs in database: ${total}`)

    // Get blogs
    const blogs = await Blog.find(query).sort({ publish_date: -1, created_at: -1 }).skip(skip).limit(limit).lean()

    console.log(`Found ${blogs.length} blogs`)

    const totalPages = Math.ceil(total / limit)

    const response = {
      blogs: blogs.map((blog: any) => ({
        ...blog,
        _id: blog._id.toString(),
        publish_date: blog.publish_date || blog.created_at,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    }

    console.log("Returning response:", {
      blogCount: response.blogs.length,
      total: response.pagination.total,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch blogs",
        details: (error as Error).message,
        blogs: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
      },
      { status: 500 },
    )
  }
}
