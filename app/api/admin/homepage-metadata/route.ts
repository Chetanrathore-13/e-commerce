import HomePageMetaData from "@/lib/models/homePageMetaData";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { saveImageToPublic } from "@/lib/image-upload";

const homePageMetaDataSchema = z.object({
    title: z.string().min(2).max(100),
    description: z.string().min(10).max(500),
    image: z.string().url(),
});

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const image = formData.get("image") as File | null;
        if (!image) {
            return NextResponse.json({ error: "Image is required" }, { status: 400 });
        }
        // Validate input
        const validatedData = homePageMetaDataSchema.parse({
            title,
            description,
            image,
        });
        // Check if the title and description are valid
        if (!validatedData.title || !validatedData.description) {
            return NextResponse.json({ error: "Invalid title or description" }, { status: 400 });
        }
        // Check if the image is a valid file
        if (!(image instanceof File)) {
            return NextResponse.json({ error: "Invalid image file" }, { status: 400 });
        }

        // upload image to public folder
        const imageUrl = await saveImageToPublic(image, "homepage-metadata");

        await connectToDatabase();

        const metaData = await HomePageMetaData.create({
            title,
            description,
            image: imageUrl,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return NextResponse.json(metaData, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create metadata" }, { status: 500 });
    }
}
export async function GET() { 
    try {
        await connectToDatabase();
        const metaData = await HomePageMetaData.findOne().sort({ createdAt: -1 }).lean();
        if (!metaData) {
            return NextResponse.json({ error: "No metadata found" }, { status: 404 });
        }
        return NextResponse.json(metaData);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch metadata" }, { status: 500 });
    }
}
