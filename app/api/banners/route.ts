import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import  Banner  from "@/lib/models/banner"

export async function GET() {
  try {
    await connectToDatabase()
    const banners = await Banner.find({ isActive: true }).sort({ position: 1 }).lean()

    return NextResponse.json({
      banners: banners.map((banner) => ({
        ...banner,
        _id: banner._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching banners:", error)
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 })
  }
}
