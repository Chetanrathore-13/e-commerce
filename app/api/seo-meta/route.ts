import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { SeoMeta } from "@/lib/models/seo-meta"

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page")

    if (!page) {
      return NextResponse.json({ error: "Page parameter is required" }, { status: 400 })
    }

    // Find active meta data for the specified page
    const meta = await SeoMeta.findOne({
      page: page,
      is_active: true,
    }).lean()

    if (!meta) {
      return NextResponse.json({ error: "Meta data not found for this page" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      meta: meta,
    })
  } catch (error) {
    console.error("Error fetching SEO meta:", error)
    return NextResponse.json({ error: "Failed to fetch SEO meta data" }, { status: 500 })
  }
}
