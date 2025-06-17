import mongoose from "mongoose"

export interface ISeoMeta {
  _id: string
  page: string
  title: string
  description: string
  keywords: string[]
  og_title?: string
  og_description?: string
  og_image?: string
  og_url?: string
  twitter_title?: string
  twitter_description?: string
  twitter_image?: string
  twitter_card?: "summary" | "summary_large_image" | "app" | "player"
  canonical_url?: string
  robots?: string
  schema_markup?: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

const seoMetaSchema = new mongoose.Schema<ISeoMeta>({
  page: {
    type: String,
    required: true,
    unique: true,
    enum: ["homepage", "products", "categories", "about", "contact", "blog", "cart", "checkout"],
  },
  title: {
    type: String,
    required: true,
    maxlength: 60,
  },
  description: {
    type: String,
    required: true,
    maxlength: 160,
  },
  keywords: [
    {
      type: String,
      trim: true,
    },
  ],
  og_title: {
    type: String,
    maxlength: 60,
  },
  og_description: {
    type: String,
    maxlength: 160,
  },
  og_image: {
    type: String,
  },
  og_url: {
    type: String,
  },
  twitter_title: {
    type: String,
    maxlength: 60,
  },
  twitter_description: {
    type: String,
    maxlength: 160,
  },
  twitter_image: {
    type: String,
  },
  twitter_card: {
    type: String,
    enum: ["summary", "summary_large_image", "app", "player"],
    default: "summary_large_image",
  },
  canonical_url: {
    type: String,
  },
  robots: {
    type: String,
    default: "index, follow",
  },
  schema_markup: {
    type: String,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
})

// Update the updated_at field before saving
seoMetaSchema.pre("save", function (next) {
  this.updated_at = new Date()
  next()
})

// Create indexes for better performance
seoMetaSchema.index({ page: 1 })
seoMetaSchema.index({ is_active: 1 })

export const SeoMeta = mongoose.models.SeoMeta || mongoose.model<ISeoMeta>("SeoMeta", seoMetaSchema)
