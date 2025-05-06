import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import { existsSync } from "fs"

// Disable body parsing, as we'll handle the multipart form data manually
export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(request: Request) {
  console.log("📤 Upload API called")

  try {
    // Parse the multipart form data
    const formData = await request.formData()
    console.log("✅ Form data parsed successfully")

    // Get the file from the form data
    const file = formData.get("file") as File | null

    if (!file) {
      console.error("❌ No file provided in the request")
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Log file details
    console.log(`📄 File received: ${file.name}, type: ${file.type}, size: ${file.size} bytes`)

    // Create a unique filename
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const fileName = `${uuidv4()}.${fileExtension}`

    // Define upload directory and file path
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    const filePath = path.join(uploadDir, fileName)

    console.log(`📁 Upload directory: ${uploadDir}`)

    // Create the uploads directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      console.log(`📁 Creating upload directory: ${uploadDir}`)
      try {
        await mkdir(uploadDir, { recursive: true })
        console.log("✅ Upload directory created successfully")
      } catch (error) {
        console.error("❌ Failed to create uploads directory:", error)
        return NextResponse.json({ error: "Server error: Failed to create uploads directory" }, { status: 500 })
      }
    }

    try {
      // Convert the file to a Buffer
      const buffer = Buffer.from(await file.arrayBuffer())
      console.log(`✅ File converted to buffer: ${buffer.length} bytes`)

      // Write the file to disk
      await writeFile(filePath, buffer)
      console.log(`✅ File saved successfully to ${filePath}`)

      // Return the public URL to the file
      const fileUrl = `/uploads/${fileName}`
      console.log(`✅ File uploaded successfully. Public URL: ${fileUrl}`)

      return NextResponse.json({
        success: true,
        url: fileUrl,
        fileName: fileName,
      })
    } catch (error) {
      console.error("❌ Error saving file:", error)
      return NextResponse.json({ error: "Failed to save file" }, { status: 500 })
    }
  } catch (error) {
    console.error("❌ Error in upload API:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
