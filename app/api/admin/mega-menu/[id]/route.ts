import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { MegaMenuConfig } from "@/lib/models"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const config = await MegaMenuConfig.findById(params.id).lean()

    if (!config) {
      return NextResponse.json({ error: "Mega menu config not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...config,
      _id: config._id.toString(),
    })
  } catch (error) {
    console.error("Error fetching mega menu config:", error)
    return NextResponse.json({ error: "Failed to fetch mega menu config" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const data = await request.json()

    const config = await MegaMenuConfig.findByIdAndUpdate(params.id, data, { new: true }).lean()

    if (!config) {
      return NextResponse.json({ error: "Mega menu config not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...config,
      _id: config._id.toString(),
    })
  } catch (error) {
    console.error("Error updating mega menu config:", error)
    return NextResponse.json({ error: "Failed to update mega menu config" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const config = await MegaMenuConfig.findByIdAndDelete(params.id)

    if (!config) {
      return NextResponse.json({ error: "Mega menu config not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting mega menu config:", error)
    return NextResponse.json({ error: "Failed to delete mega menu config" }, { status: 500 })
  }
}
