import Image from "next/image";
import Link from "next/link";
import FeaturedCategories from "@/components/featured-categories";
import NewArrivals from "@/components/new-arrivals";
import BestSellers from "@/components/best-sellers";
import FeaturedCollections from "@/components/featured-collections";
import Testimonials from "@/components/testimonials";
import InstagramFeed from "@/components/instagram-feed";
import Art from "../public/Banners/art.png";

import {
  getHomepageSectionsData,
  getTestimonialsData,
  getCategoriesData,
  getProductsData,
} from "@/lib/api";

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
    getProductsData({ isBestSeller: true, limit: 4 }),
  ]);

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

  console.log("Sections Data:", sections);

  // Find sections by type
  const findSectionByType = (type: string) =>
    sections.find((section) => section.type === type);

  // Get featured categories section
  const featuredCategoriesSection = findSectionByType("featured-categories");
  // Get new arrivals section
  const newArrivalsSection = findSectionByType("new-arrivals");
  // Get best sellers section
  const bestSellersSection = findSectionByType("best-sellers");
  // Get featured collections section
  const featuredCollectionsSection = findSectionByType("featured-collections");
  // Get testimonials section
  const testimonialsSection = findSectionByType("testimonials");
  // Get instagram feed section
  const instagramFeedSection = findSectionByType("instagram-feed");

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] w-full">
        <Image
          src={sections[0]?.image || "/images/hero.jpg"}
          alt="Parpra - Ethnic Wear Collection"
          fill
          className="object-cover"
          priority
        />
        {/* <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-center p-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Discover Timeless Elegance
            </h1>
            <p className="text-lg md:text-xl text-white mb-6">
              Explore our curated collection of premium ethnic wear
            </p>
            <Link
              href="/products"
              className="inline-block bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div> */}
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
      <section className="relative h-[70vh] md:h-[80vh] w-full bg-amber-700">
        <Image src={Art} alt="" fill className="object-cover" priority />
      </section>

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
      <FeaturedCollections
        sectionImage={featuredCollectionsSection?.image}
        sectionTitle={
          featuredCollectionsSection?.title || "Featured Collections"
        }
        sectionSubtitle={
          featuredCollectionsSection?.subtitle ||
          "Explore our curated collections"
        }
      />

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
