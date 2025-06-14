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


// update homepage metadata
export async function PUT(request: Request) {
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

        // upload image to public folder
        const imageUrl = await saveImageToPublic(image, "homepage-metadata");

        await connectToDatabase();

        const metaData = await HomePageMetaData.findOneAndUpdate(
            {},
            {
                title: validatedData.title,
                description: validatedData.description,
                image: imageUrl,
                updatedAt: new Date(),
            },
            { new: true, upsert: true }
        ).lean();

        return NextResponse.json(metaData, { status: 200 });
    } catch (error) {
        console.error("Error updating homepage metadata:", error);
        return NextResponse.json({ error: "Failed to update metadata" }, { status: 500 });
    }
}