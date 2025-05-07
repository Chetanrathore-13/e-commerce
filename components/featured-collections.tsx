"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getBaseUrl } from "@/lib/api";
// import Sar from "../public/features-img/sar.png"

interface Collection {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

interface FeaturedCollectionsProps {
  sectionImage?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
}

export default function FeaturedCollections({
  sectionImage,
  sectionTitle = "Featured Collections",
  sectionSubtitle = "Explore our curated collections",
}: FeaturedCollectionsProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCollections() {
      try {
        const baseUrl = getBaseUrl();
        const res = await fetch(`${baseUrl}/api/collections?featured=true`);
        if (!res.ok) {
          throw new Error("Failed to fetch collections");
        }
        const data = await res.json();
        setCollections(data.collections || []);
      } catch (error) {
        console.error("Error fetching collections:", error);
        // Use default collections if API fails
        setCollections([
          {
            _id: "1",
            name: "Wedding Collection",
            slug: "wedding",
            image: "/sar.png",
            description: "Exquisite bridal wear for your special day",
          },
          {
            _id: "2",
            name: "Festival Collection",
            slug: "festival",
            image: "/elegant-indian-woman-saree.png",
            description: "Celebrate festivals in style",
          },
          {
            _id: "3",
            name: "Designer Collection",
            slug: "designer",
            image: "/elegant-evening-gown.png",
            description: "Exclusive designer pieces",
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    getCollections();
  }, []);

  // If loading or no collections, show skeleton
  if (loading || collections.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div className="mb-6 md:mb-0 md:max-w-xl">
              <h2 className="text-3xl font-bold mb-4">{sectionTitle}</h2>
              <p className="text-gray-600">{sectionSubtitle}</p>
            </div>

            {sectionImage && (
              <div className="w-full md:w-1/3 lg:w-1/4 relative h-40 md:h-60">
                <Image
                  src={sectionImage || "/placeholder.svg"}
                  alt={sectionTitle || "Featured Collections"}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative h-80 bg-gray-200 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    // <section className="py-16">
    // <div className="container mx-auto px-4">
    //   <div className="flex flex-col md:flex-row items-center justify-between mb-12">
    //     <div className="mb-6 md:mb-0 md:max-w-xl">
    //       <h2 className="text-3xl font-bold mb-4">{sectionTitle}</h2>
    //       <p className="text-gray-600">{sectionSubtitle}</p>
    //     </div>

    //       {sectionImage && (
    //         <div className="w-full md:w-1/3 lg:w-1/4 relative h-40 md:h-60">
    //           <Image
    //             src={sectionImage || "/placeholder.svg"}
    //             alt={sectionTitle || "Featured Collections"}
    //             fill
    //             className="object-cover rounded-lg"
    //           />
    //         </div>
    //       )}
    //     </div>

    //     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    //       {collections.map((collection) => (
    //         <Link href={`/collections/${collection.slug}`} key={collection._id}>
    //           <div className="relative h-80 group overflow-hidden rounded-lg">
    //             <Image
    //               src={collection.image || `/placeholder.svg?height=320&width=480&query=${collection.name}`}
    //               alt={collection.name}
    //               fill
    //               className="object-cover transition-transform group-hover:scale-105 duration-500"
    //             />
    //             <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
    //               <h3 className="text-2xl font-bold mb-2">{collection.name}</h3>
    //               <p className="text-sm text-gray-200 mb-4">{collection.description}</p>
    //               <span className="inline-block text-sm font-medium border-b border-white pb-1">
    //                 Explore Collection
    //               </span>
    //             </div>
    //           </div>
    //         </Link>
    //       ))}
    //     </div>
    //   </div>
    // </section>
    <main className="container mx-auto px-4 py-8">


      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="mb-6 md:mb-0 md:max-w-xl">
            <h2 className="text-5xl font-light mb-2 text-center">{sectionTitle}</h2>
            <p className="text-gray-600 text-start ml-2 pt-20">{sectionSubtitle}</p>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Large hero image - 50% width on desktop */}
        <div className="relative h-[600px] md:h-[800px] overflow-hidden rounded-lg">
          <Link href="/category/sarees">
            <div className="relative w-full h-full group">
              <Image
                src="/luxury-saree-collection.png"
                alt="Luxury Saree Collection"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/20 flex items-end p-6">
                <span className="text-white text-2xl font-medium">Sarees</span>
              </div>
            </div>
          </Link>
        </div>

        {/* 2x2 Grid of smaller images - 50% width on desktop */}
        <div className="grid grid-cols-2 gap-4">
          {/* Top row */}
          <div className="relative h-[300px] md:h-[395px] overflow-hidden rounded-lg">
            <Link href="/category/organza-designer">
              <div className="relative w-full h-full group">
                <Image
                  src="/red-organza-saree-woman.png"
                  alt="Organza Designer Sarees"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-end p-4">
                  <span className="text-white text-lg font-medium">
                    Organza Designer
                  </span>
                </div>
              </div>
            </Link>
          </div>

          <div className="relative h-[300px] md:h-[395px] overflow-hidden rounded-lg">
            <Link href="/category/handloom-silk">
              <div className="relative w-full h-full group">
                <Image
                  src="/placeholder.svg?key=afco5"
                  alt="Handloom Silk Embroidery Sarees"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-end p-4">
                  <span className="text-white text-lg font-medium">
                    Handloom Silk Embroidery Saree
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Bottom row */}
          <div className="relative h-[300px] md:h-[395px] overflow-hidden rounded-lg">
            <Link href="/category/kanchipuram">
              <div className="relative w-full h-full group">
                <Image
                  src="/woman-kanchipuram-saree.png"
                  alt="Kanchipuram Sarees"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-end p-4">
                  <span className="text-white text-lg font-medium">
                    Kanchipuram Saree
                  </span>
                </div>
              </div>
            </Link>
          </div>

          <div className="relative h-[300px] md:h-[395px] overflow-hidden rounded-lg">
            <Link href="/category/ready-blouse">
              <div className="relative w-full h-full group">
                <Image
                  src="/golden-saree-woman.png"
                  alt="Ready Blouse Sarees"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-end p-4">
                  <span className="text-white text-lg font-medium">
                    Ready Blouse Sarees
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
