import Image from "next/image"
import Link from "next/link"
import FeaturedCategories from "@/components/featured-categories"
import NewArrivals from "@/components/new-arrivals"
import BestSellers from "@/components/best-sellers"
import FeaturedCollections from "@/components/featured-collections"
import Testimonials from "@/components/testimonials"
import InstagramFeed from "@/components/instagram-feed"
import {
  getBannersData,
  getHomepageSectionsData,
  getTestimonialsData,
  getCategoriesData,
  getProductsData,
} from "@/lib/api"

// This function runs at build time and when revalidated
export const revalidate = 3600 // Revalidate every hour

export default async function Home() {
  // Fetch all the data needed for the homepage with error handling
  const [bannersData, sectionsData, testimonialsData, categoriesData, newArrivalsData, bestSellersData] =
    await Promise.allSettled([
      getBannersData(),
      getHomepageSectionsData(),
      getTestimonialsData(),
      getCategoriesData(),
      getProductsData({ sort: "createdAt", limit: 8 }),
      getProductsData({ isBestSeller: true, limit: 4 }),
    ])

  // Extract the data from the responses, handling potential rejections
  const banners = bannersData.status === "fulfilled" ? bannersData.value?.banners || [] : []
  const sections = sectionsData.status === "fulfilled" ? sectionsData.value?.sections || [] : []
  const testimonials = testimonialsData.status === "fulfilled" ? testimonialsData.value?.testimonials || [] : []
  const categories = categoriesData.status === "fulfilled" ? categoriesData.value?.categories || [] : []
  const newArrivals = newArrivalsData.status === "fulfilled" ? newArrivalsData.value?.products || [] : []
  const bestSellers = bestSellersData.status === "fulfilled" ? bestSellersData.value?.products || [] : []

  console.log("Banners:", banners)
  console.log("Sections:", sections)
  console.log("Testimonials:", testimonials)
  console.log("Categories:", categories)
  console.log("New Arrivals:", newArrivals)
  console.log("Best Sellers:", bestSellers)

  // Find the hero banner (assuming it has a specific type or position)
  const heroBanner = banners.find((banner) => banner?.position === "hero") || banners[0]

  // Get other banners for secondary positions
  const secondaryBanners = banners.filter((banner) => banner?.position !== "hero").slice(0, 2)

  // Find sections by type
  const findSectionByType = (type: string) => sections.find((section) => section.type === type)

  // Get featured categories section
  const featuredCategoriesSection = findSectionByType("featured-categories")
  // Get new arrivals section
  const newArrivalsSection = findSectionByType("new-arrivals")
  // Get best sellers section
  const bestSellersSection = findSectionByType("best-sellers")
  // Get featured collections section
  const featuredCollectionsSection = findSectionByType("featured-collections")
  // Get testimonials section
  const testimonialsSection = findSectionByType("testimonials")
  // Get instagram feed section
  const instagramFeedSection = findSectionByType("instagram-feed")

  console.log("Sections:", sections)
  console.log("Featured Categories Section:", featuredCategoriesSection)

  return (
    <main>
      {/* Hero Banner */}
      <section className="relative">
        <div className="relative h-[70vh] md:h-[80vh] w-full">
          <Image
            src={heroBanner?.image || "/celebratory-banner.png"}
            alt={heroBanner?.title || "Hero Banner"}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-center p-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {heroBanner?.title || "Celebrate in Style"}
              </h1>
              <p className="text-lg md:text-xl text-white mb-6">
                {heroBanner?.subtitle || "Discover our new festive collection"}
              </p>
              <Link
                href={heroBanner?.buttonLink || "/collections/festive"}
                className="inline-block bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                {heroBanner?.buttonText || "Shop Now"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <FeaturedCategories
        categories={categories}
        sectionImage={featuredCategoriesSection?.image}
        sectionTitle={featuredCategoriesSection?.title}
        sectionSubtitle={featuredCategoriesSection?.subtitle}
      />

      {/* New Arrivals */}
      <NewArrivals
        products={newArrivals}
        sectionImage={newArrivalsSection?.image}
        sectionTitle={newArrivalsSection?.title}
        sectionSubtitle={newArrivalsSection?.subtitle}
      />

      {/* Secondary Banners */}
      <section className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {secondaryBanners.length > 0 ? (
          secondaryBanners.map((banner, index) => (
            <div key={banner?._id || index} className="relative h-80 overflow-hidden rounded-lg">
              <Image
                src={banner?.image || `/fashion-banner.png`}
                alt={banner?.title || `Fashion Banner ${index + 1}`}
                fill
                className="object-cover transition-transform hover:scale-105 duration-700"
              />
              <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-center p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{banner?.title || "Exclusive Collection"}</h3>
                <p className="text-white mb-4">{banner?.subtitle || "Limited time offer"}</p>
                <Link
                  href={banner?.buttonLink || "/collections"}
                  className="inline-block bg-white hover:bg-gray-100 text-gray-900 px-6 py-2 rounded-md font-medium transition-colors"
                >
                  {banner?.buttonText || "Discover"}
                </Link>
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="relative h-80 overflow-hidden rounded-lg">
              <Image
                src="/fashion-banner.png"
                alt="Fashion Banner 1"
                fill
                className="object-cover transition-transform hover:scale-105 duration-700"
              />
              <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-center p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Exclusive Collection</h3>
                <p className="text-white mb-4">Limited time offer</p>
                <Link
                  href="/collections"
                  className="inline-block bg-white hover:bg-gray-100 text-gray-900 px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Discover
                </Link>
              </div>
            </div>
            <div className="relative h-80 overflow-hidden rounded-lg">
              <Image
                src="/fashion-banner.png"
                alt="Fashion Banner 2"
                fill
                className="object-cover transition-transform hover:scale-105 duration-700"
              />
              <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-center p-6">
                <h3 className="text-2xl font-bold text-white mb-2">New Season</h3>
                <p className="text-white mb-4">Spring/Summer 2023</p>
                <Link
                  href="/collections/summer"
                  className="inline-block bg-white hover:bg-gray-100 text-gray-900 px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Best Sellers */}
      <BestSellers
        products={bestSellers}
        sectionImage={bestSellersSection?.image}
        sectionTitle={bestSellersSection?.title}
        sectionSubtitle={bestSellersSection?.subtitle}
      />

      {/* Featured Collections */}
      <FeaturedCollections
        sectionImage={featuredCollectionsSection?.image}
        sectionTitle={featuredCollectionsSection?.title}
        sectionSubtitle={featuredCollectionsSection?.subtitle}
      />

      {/* Testimonials */}
      <Testimonials
        testimonials={testimonials}
        sectionImage={testimonialsSection?.image}
        sectionTitle={testimonialsSection?.title}
        sectionSubtitle={testimonialsSection?.subtitle}
      />

      {/* Instagram Feed */}
      <InstagramFeed
        sectionImage={instagramFeedSection?.image}
        sectionTitle={instagramFeedSection?.title}
        sectionSubtitle={instagramFeedSection?.subtitle}
      />
    </main>
  )
}
