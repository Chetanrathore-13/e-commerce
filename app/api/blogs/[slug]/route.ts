import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import {Blog} from "@/lib/models/blog"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    console.log("Fetching blog with slug:", params.slug)
    await connectToDatabase()

    const slug = params.slug

    // Find the blog by slug
    const blog = await Blog.findOne({ slug }).lean()

    console.log("Found blog:", blog ? "Yes" : "No")

    if (!blog) {
      console.log("Blog not found for slug:", slug)
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    // Get related blogs (by category or tag)
    const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id },
      $or: [{ categories: { $in: blog.categories || [] } }, { tags: { $in: blog.tags || [] } }],
    })
      .sort({ publish_date: -1, created_at: -1 })
      .limit(3)
      .lean()

    console.log("Found related blogs:", relatedBlogs.length)

    return NextResponse.json({
      blog: {
        ...blog,
        _id: blog._id.toString(),
        publish_date: blog.publish_date || blog.created_at,
      },
      relatedBlogs: relatedBlogs.map((relatedBlog: any) => ({
        ...relatedBlog,
        _id: relatedBlog._id.toString(),
        publish_date: relatedBlog.publish_date || relatedBlog.created_at,
      })),
    })
  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch blog",
        details: (error as Error).message,
        slug: params.slug,
      },
      { status: 500 },
    )
  }
}
