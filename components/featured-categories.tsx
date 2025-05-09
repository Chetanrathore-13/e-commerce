import Image from "next/image";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  isFeatured?: boolean;
}

interface FeaturedCategoriesProps {
  categories?: Category[];
  sectionImage?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
}

export default function FeaturedCategories({
  categories = [],
  sectionImage,
  sectionTitle = "Shop by Category",
  sectionSubtitle,
}: FeaturedCategoriesProps) {

  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : [];

  // Fallback categories if none are provided
  const fallbackCategories = [
    {
      _id: "1",
      name: "Women",
      slug: "women",
      image: "/elegant-indian-woman-saree.png",
    },
    {
      _id: "2",
      name: "Men",
      slug: "men",
      image: "/indian-man-sherwani.png",
    },
    {
      _id: "3",
      name: "Bridal",
      slug: "bridal",
      image: "/indian-bride-red-lehenga.png",
    },
    {
      _id: "4",
      name: "Accessories",
      slug: "accessories",
      image: "/placeholder.svg?key=9livb",
    },
  ];

  // Use provided categories or fallback
  const displayCategories =
    safeCategories.length > 0 ? safeCategories : fallbackCategories;

  return (
    <section className="py-16 w-full">
      <div className="flex flex-col items-center mx-auto px-0 sm:px-4 md:px-8 lg:px-16 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 w-full">
          <div className="mb-6 md:mb-0 ">
            <h2 className="text-5xl font-light mb-2 text-center">
              {sectionTitle}
            </h2>
            {sectionSubtitle && (
              <p className="text-gray-600 text-start mt-2 pt-2 ">
                {sectionSubtitle}
              </p>
            )}
          </div>

          {sectionImage && (
            <div className="w-full md:w-1/3 relative h-100">
              <Image
                src={sectionImage || "/placeholder.svg"}
                alt={sectionTitle}
                fill
                className="object-cover rounded-sm"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-9 w-full">
          {displayCategories.slice(0, 6).map((category) => (
            <Link
              key={category._id}
              href={`/${category.slug}`}
              className="group"
            >
              <div className="relative overflow-hidden   aspect-square mb-4">
                <Image
                  src={
                    category.image ||
                    "/placeholder.svg?height=600&width=600&query=ethnic wear"
                  }
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-center text-lg font-medium">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
