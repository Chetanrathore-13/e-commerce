import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import ContactSubmission from "@/lib/models/ContactSubmission"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const submission = await ContactSubmission.findById(params.id)

    if (!submission) {
      return NextResponse.json({ error: "Contact submission not found" }, { status: 404 })
    }

    return NextResponse.json(submission)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch contact submission" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const data = await request.json()
    const updatedSubmission = await ContactSubmission.findByIdAndUpdate(params.id, data, { new: true })

    if (!updatedSubmission) {
      return NextResponse.json({ error: "Contact submission not found" }, { status: 404 })
    }

    return NextResponse.json(updatedSubmission)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update contact submission" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const deletedSubmission = await ContactSubmission.findByIdAndDelete(params.id)

    if (!deletedSubmission) {
      return NextResponse.json({ error: "Contact submission not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Contact submission deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete contact submission" }, { status: 500 })
  }
}
