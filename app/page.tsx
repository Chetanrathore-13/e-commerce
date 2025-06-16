import Image from "next/image";
import Link from "next/link";
import FeaturedCategories from "@/components/featured-categories";
import NewArrivals from "@/components/new-arrivals";
import BestSellers from "@/components/best-sellers";
import Testimonials from "@/components/testimonials";
import HeroBannerSlider from "@/components/hero-banner-slider";
import Art from "../public/Banners/art.png";
import {
  getHomepageSectionsData,
  getTestimonialsData,
  getCategoriesData,
  getProductsData,
} from "@/lib/api";
import ban4 from "@/public/mobbanner/mob4.png";
import type { Metadata } from "next";

// Generate dynamic metadata from database
export async function generateMetadata(): Promise<Metadata> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const response = await fetch(`${baseUrl}/api/seo-meta?page=homepage`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error("Failed to fetch meta data")
    }

    const data = await response.json()
    const meta = data.meta

    if (!meta) {
      // Fallback metadata if no database entry found
      return {
        title: "Parpra - Premium Indian Ethnic Wear | Sarees, Lehengas & More",
        description:
          "Discover exquisite Indian ethnic wear at Parpra. Shop premium sarees, lehengas, salwar suits, and traditional clothing with authentic craftsmanship.",
        keywords: [
          "indian ethnic wear",
          "sarees",
          "lehengas",
          "salwar suits",
          "traditional clothing",
          "indian fashion",
        ],
      }
    }

    // Build metadata object from database
    const metadata: Metadata = {
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
    }

    // Add Open Graph data if available
    if (meta.og_title || meta.og_description || meta.og_image) {
      metadata.openGraph = {
        title: meta.og_title || meta.title,
        description: meta.og_description || meta.description,
        images: meta.og_image ? [{ url: meta.og_image }] : undefined,
        url: meta.og_url,
      }
    }

    // Add Twitter data if available
    if (meta.twitter_title || meta.twitter_description || meta.twitter_image) {
      metadata.twitter = {
        card: meta.twitter_card || "summary_large_image",
        title: meta.twitter_title || meta.title,
        description: meta.twitter_description || meta.description,
        images: meta.twitter_image ? [meta.twitter_image] : undefined,
      }
    }

    // Add robots directive
    if (meta.robots) {
      metadata.robots = meta.robots
    }

    // Add canonical URL
    if (meta.canonical_url) {
      metadata.alternates = {
        canonical: meta.canonical_url,
      }
    }

    return metadata
  } catch (error) {
    console.error("Error generating metadata:", error)

    // Return fallback metadata on error
    return {
      title: "Parpra - Premium Indian Ethnic Wear | Sarees, Lehengas & More",
      description:
        "Discover exquisite Indian ethnic wear at Parpra. Shop premium sarees, lehengas, salwar suits, and traditional clothing with authentic craftsmanship.",
      keywords: ["indian ethnic wear", "sarees", "lehengas", "salwar suits", "traditional clothing", "indian fashion"],
    }
  }
}


// This function runs at build time and when revalidated
export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  // Fetch all the data needed for the homepage with error handling
  const [
    sectionsData,
    testimonialsData,
    categoriesData,
    newArrivalsData,
    bestSellersData,
  ] = await Promise.allSettled([
    getHomepageSectionsData(),
    getTestimonialsData(),
    getCategoriesData(),
    getProductsData({ sort: "createdAt", limit: 8 }),
    getProductsData({ isBestSeller: true, limit: 6 }),
  ]);

  interface Section {
    type: string;
    image?: string;
    title?: string;
    subtitle?: string;
    isActive?: boolean;
  }
  // Extract the data from the responses, handling potential rejections
  const sections =
    sectionsData.status === "fulfilled"
      ? sectionsData.value?.sections || []
      : [];
  const testimonials =
    testimonialsData.status === "fulfilled"
      ? testimonialsData.value?.testimonials || []
      : [];
  const categories =
    categoriesData.status === "fulfilled"
      ? categoriesData.value?.categories || []
      : [];
  const newArrivals =
    newArrivalsData.status === "fulfilled"
      ? newArrivalsData.value?.products || []
      : [];
  const bestSellers =
    bestSellersData.status === "fulfilled"
      ? bestSellersData.value?.products || []
      : [];

  // Filter banner sections from homepage sections
  const bannerSections = sections.filter(
    (section: Section) => section.type === "banner" && section.isActive
  );

  const customBannerSections = sections.filter(
    (section: Section) => section.type === "custom" && section.isActive
    
  );
  console.log("Custom Banner Sections:", customBannerSections);

  // Sort banner sections by position
  bannerSections.sort((a: Section & { position: number }, b: Section & { position: number }) => a.position - b.position);

  // Define the interface for section
  interface Section {
    type: string;
    image?: string;
    title?: string;
    subtitle?: string;
  }

  // Find sections by type
  const findSectionByType = (type: string) =>
    sections.find((section: Section) => section.type === type);

  // Get featured categories section
  const featuredCategoriesSection = findSectionByType("featured-categories");
  // Get new arrivals section
  const newArrivalsSection = findSectionByType("new-arrivals");
  // Get best sellers section
  const bestSellersSection = findSectionByType("best-sellers");
  // Get testimonials section
  const testimonialsSection = findSectionByType("testimonials");

  return (
    <main>
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] min-h-[300px]">
        {/* Hero Banner Slider */}
        <HeroBannerSlider bannerSections={bannerSections} customSections={customBannerSections} />
      </section>

      {/* Featured Categories */}
      <FeaturedCategories
        categories={categories}
        sectionImage={featuredCategoriesSection?.image}
        sectionTitle={featuredCategoriesSection?.title || "Shop by Category"}
        sectionSubtitle={
          featuredCategoriesSection?.subtitle ||
          "Explore our diverse collection of ethnic wear"
        }
      />

      {/* Banners-img */}
      <Link href="/products/floor-length-anarkali-with-gold-foil-print">
        <section className="relative h-[60vh] sm:h-[50vh] md:h-[60vh] w-full ">
          {/* Desktop Image (visible on sm and above) */}
          <div className="hidden sm:block absolute inset-0">
            <Image
              src={Art} // Desktop version
              alt="Hero Banner - Desktop"
              fill
              sizes="(min-width: 640px) 100vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Mobile Image (visible below sm) */}
          <div className="block sm:hidden absolute inset-0">
            <Image
              src={ban4} // Replace with actual mobile image
              alt="Hero Banner - Mobile"
              fill
              sizes="(max-width: 639px) 70vw"
              className="object-contain"
              style={{ objectPosition: "center" }} // Adjust the position as needed
              priority
            />
          </div>
        </section>
      </Link>

      {/* Featured Categories */}

      {/* New Arrivals */}
      <NewArrivals
        products={newArrivals}
        sectionImage={newArrivalsSection?.image}
        sectionTitle={newArrivalsSection?.title || "New Arrivals"}
        sectionSubtitle={
          newArrivalsSection?.subtitle || "Check out our latest products"
        }
      />

      {/* Best Sellers */}
      <BestSellers
        products={bestSellers}
        sectionImage={bestSellersSection?.image}
        sectionTitle={bestSellersSection?.title || "Best Sellers"}
        sectionSubtitle={
          bestSellersSection?.subtitle || "Our most popular products"
        }
      />

      {/* Featured Collections */}
      {/* <FeaturedCollections
        sectionImage={featuredCollectionsSection?.image}
        sectionTitle={
          featuredCollectionsSection?.title || "Featured Collections"
        }
        sectionSubtitle={
          featuredCollectionsSection?.subtitle ||
          "Explore our curated collections"
        }
      /> */}

      {/* Testimonials */}
      <Testimonials
        testimonials={testimonials}
        sectionImage={testimonialsSection?.image}
        sectionTitle={testimonialsSection?.title || "What Our Customers Say"}
        sectionSubtitle={
          testimonialsSection?.subtitle ||
          "Read testimonials from our satisfied customers"
        }
      />

      {/* Instagram Feed */}
      {/* <InstagramFeed
        sectionImage={instagramFeedSection?.image}
        sectionTitle={instagramFeedSection?.title || "Follow Us on Instagram"}
        sectionSubtitle={
          instagramFeedSection?.subtitle || "Get inspired by our latest posts"
        }
      /> */}
    </main>
  );
}
