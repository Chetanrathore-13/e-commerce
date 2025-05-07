import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { Blog } from "@/lib/models/blog"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    await connectToDatabase()

    const slug = params.slug

    const blog = await Blog.findOne({ slug, published: true }).lean()

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    // Get related blogs (by category or tag)
    const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id },
      published: true,
      $or: [{ categories: { $in: blog.categories } }, { tags: { $in: blog.tags } }],
    })
      .sort({ publish_date: -1 })
      .limit(3)
      .lean()

    return NextResponse.json({
      blog: {
        ...blog,
        _id: blog._id.toString(),
      },
      relatedBlogs: relatedBlogs.map((relatedBlog) => ({
        ...relatedBlog,
        _id: relatedBlog._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 })
  }
}
