const { MongoClient } = require("mongodb")
require("dotenv").config()

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/parpra"
console.log(`Using MongoDB URI: ${MONGODB_URI}`)
const defaultSeoMeta = [
  {
    page: "homepage",
    title: "PARPRA - Premium Ethnic Wear Collection | Sarees, Lehengas & More",
    description:
      "Discover exquisite ethnic wear at PARPRA. Shop premium sarees, lehengas, and traditional outfits with worldwide free shipping. Authentic Indian fashion for every occasion.",
    keywords: [
      "ethnic wear",
      "sarees",
      "lehengas",
      "traditional clothing",
      "indian fashion",
      "premium ethnic wear",
      "designer sarees",
      "wedding lehengas",
      "traditional outfits",
      "indian clothing online",
    ],
    og_title: "PARPRA - Premium Ethnic Wear Collection",
    og_description:
      "Discover exquisite ethnic wear at PARPRA. Shop premium sarees, lehengas, and traditional outfits with worldwide free shipping.",
    og_image: "/images/og-homepage.jpg",
    og_url: "https://parpra.com",
    twitter_title: "PARPRA - Premium Ethnic Wear Collection",
    twitter_description:
      "Discover exquisite ethnic wear at PARPRA. Shop premium sarees, lehengas, and traditional outfits with worldwide free shipping.",
    twitter_image: "/images/twitter-homepage.jpg",
    twitter_card: "summary_large_image",
    canonical_url: "https://parpra.com",
    robots: "index, follow",
    schema_markup: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "PARPRA",
      description: "Premium Ethnic Wear Collection",
      url: "https://parpra.com",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://parpra.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    }),
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    page: "products",
    title: "Premium Ethnic Wear Products | PARPRA Collection",
    description:
      "Browse our extensive collection of premium ethnic wear. Find the perfect saree, lehenga, or traditional outfit for any occasion. Quality guaranteed.",
    keywords: [
      "ethnic wear products",
      "saree collection",
      "lehenga collection",
      "traditional wear",
      "indian outfits",
      "ethnic fashion",
      "designer wear",
      "premium clothing",
    ],
    og_title: "Premium Ethnic Wear Products | PARPRA Collection",
    og_description:
      "Browse our extensive collection of premium ethnic wear. Find the perfect saree, lehenga, or traditional outfit for any occasion.",
    og_image: "/images/og-products.jpg",
    twitter_title: "Premium Ethnic Wear Products | PARPRA Collection",
    twitter_description:
      "Browse our extensive collection of premium ethnic wear. Find the perfect saree, lehenga, or traditional outfit for any occasion.",
    twitter_card: "summary_large_image",
    canonical_url: "https://parpra.com/products",
    robots: "index, follow",
    schema_markup: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "PARPRA Products",
      description: "Premium Ethnic Wear Products Collection",
      url: "https://parpra.com/products",
    }),
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
]

async function seedSeoMeta() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db()
    const collection = db.collection("seometas")

    // Clear existing SEO meta data
    await collection.deleteMany({})
    console.log("Cleared existing SEO meta data")

    // Insert default SEO meta data
    const result = await collection.insertMany(defaultSeoMeta)
    console.log(`Inserted ${result.insertedCount} SEO meta records`)

    // Create indexes
    await collection.createIndex({ page: 1 }, { unique: true })
    await collection.createIndex({ is_active: 1 })
    console.log("Created indexes for SEO meta collection")

    console.log("SEO meta data seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding SEO meta data:", error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

// Run the seeding function
seedSeoMeta()
