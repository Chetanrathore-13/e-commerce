import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { SeoMeta } from "@/lib/models/seo-meta"

// GET /api/admin/seo-meta/[id] - Get single SEO meta data
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const seoMeta = await SeoMeta.findById(id)

    if (!seoMeta) {
      return NextResponse.json({ error: "SEO meta data not found" }, { status: 404 })
    }

    return NextResponse.json({ seoMeta })
  } catch (error) {
    console.error("Error fetching SEO meta data:", error)
    return NextResponse.json({ error: "Failed to fetch SEO meta data" }, { status: 500 })
  }
}

// PUT /api/admin/seo-meta/[id] - Update SEO meta data
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id } = await params
    await connectToDatabase()

    const body = await request.json()
    const {
      page,
      title,
      description,
      keywords,
      og_title,
      og_description,
      og_image,
      og_url,
      twitter_title,
      twitter_description,
      twitter_image,
      twitter_card,
      canonical_url,
      robots,
      schema_markup,
      is_active,
    } = body

    // Validate required fields
    if (!page || !title || !description) {
      return NextResponse.json({ error: "Page, title, and description are required" }, { status: 400 })
    }

    const seoMeta = await SeoMeta.findById(id)

    if (!seoMeta) {
      return NextResponse.json({ error: "SEO meta data not found" }, { status: 404 })
    }

    // Check if page name is being changed and if it conflicts with existing
    if (seoMeta.page !== page) {
      const existingSeoMeta = await SeoMeta.findOne({ page, _id: { $ne: id } })
      if (existingSeoMeta) {
        return NextResponse.json({ error: "SEO meta data for this page already exists" }, { status: 400 })
      }
    }

    // Update the SEO meta data
    seoMeta.page = page
    seoMeta.title = title
    seoMeta.description = description
    seoMeta.keywords = keywords || []
    seoMeta.og_title = og_title
    seoMeta.og_description = og_description
    seoMeta.og_image = og_image
    seoMeta.og_url = og_url
    seoMeta.twitter_title = twitter_title
    seoMeta.twitter_description = twitter_description
    seoMeta.twitter_image = twitter_image
    seoMeta.twitter_card = twitter_card || "summary_large_image"
    seoMeta.canonical_url = canonical_url
    seoMeta.robots = robots || "index, follow"
    seoMeta.schema_markup = schema_markup
    seoMeta.is_active = is_active !== undefined ? is_active : true

    await seoMeta.save()

    return NextResponse.json({
      message: "SEO meta data updated successfully",
      seoMeta,
    })
  } catch (error) {
    console.error("Error updating SEO meta data:", error)
    return NextResponse.json({ error: "Failed to update SEO meta data" }, { status: 500 })
  }
}

// DELETE /api/admin/seo-meta/[id] - Delete SEO meta data
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const { id } = await params
    const seoMeta = await SeoMeta.findById(id)

    if (!seoMeta) {
      return NextResponse.json({ error: "SEO meta data not found" }, { status: 404 })
    }

    await SeoMeta.findByIdAndDelete(id)

    return NextResponse.json({
      message: "SEO meta data deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting SEO meta data:", error)
    return NextResponse.json({ error: "Failed to delete SEO meta data" }, { status: 500 })
  }
}
