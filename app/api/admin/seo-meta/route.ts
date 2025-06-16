import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { SeoMeta } from "@/lib/models/seo-meta"

// GET /api/admin/seo-meta - Get all SEO meta data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const pageFilter = searchParams.get("pageFilter") || ""

    const skip = (page - 1) * limit

    // Build query
    const query: any = {}

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { page: { $regex: search, $options: "i" } },
      ]
    }

    if (pageFilter) {
      query.page = pageFilter
    }

    const [seoMetas, totalCount] = await Promise.all([
      SeoMeta.find(query).sort({ created_at: -1 }).skip(skip).limit(limit).lean(),
      SeoMeta.countDocuments(query),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      seoMetas,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching SEO meta data:", error)
    return NextResponse.json({ error: "Failed to fetch SEO meta data" }, { status: 500 })
  }
}

// POST /api/admin/seo-meta - Create new SEO meta data
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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

    // Check if SEO meta for this page already exists
    const existingSeoMeta = await SeoMeta.findOne({ page })
    if (existingSeoMeta) {
      return NextResponse.json({ error: "SEO meta data for this page already exists" }, { status: 400 })
    }

    const seoMeta = new SeoMeta({
      page,
      title,
      description,
      keywords: keywords || [],
      og_title,
      og_description,
      og_image,
      og_url,
      twitter_title,
      twitter_description,
      twitter_image,
      twitter_card: twitter_card || "summary_large_image",
      canonical_url,
      robots: robots || "index, follow",
      schema_markup,
      is_active: is_active !== undefined ? is_active : true,
    })

    await seoMeta.save()

    return NextResponse.json(
      {
        message: "SEO meta data created successfully",
        seoMeta,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating SEO meta data:", error)
    return NextResponse.json({ error: "Failed to create SEO meta data" }, { status: 500 })
  }
}
