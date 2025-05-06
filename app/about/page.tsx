import Image from "next/image"
import { CheckCircle } from "lucide-react"

export const metadata = {
  title: "About Us | Your Fashion Store",
  description: "Learn about our story, mission, and the team behind Your Fashion Store",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">About Us</h1>

        {/* Our Story */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded in 2010, Your Fashion Store began as a small boutique in New Delhi with a vision to bring
                authentic Indian craftsmanship to the modern fashion landscape. What started as a passion project by our
                founder, Priya Sharma, has grown into one of India's most beloved ethnic wear destinations.
              </p>
              <p className="text-gray-700">
                Over the years, we've expanded our collection to include a wide range of traditional and contemporary
                designs, always staying true to our roots while embracing innovation. Our journey has been defined by a
                commitment to quality, sustainability, and celebrating the rich textile heritage of India.
              </p>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden">
              <Image src="/placeholder.svg?key=nnylk" alt="Our Store" fill className="object-cover" />
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-amber-700 mr-2" />
                <h3 className="text-xl font-medium">Authenticity</h3>
              </div>
              <p className="text-gray-700">
                We celebrate the rich heritage of Indian craftsmanship, working directly with artisans to preserve
                traditional techniques while creating contemporary designs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-amber-700 mr-2" />
                <h3 className="text-xl font-medium">Sustainability</h3>
              </div>
              <p className="text-gray-700">
                We're committed to ethical production practices, using eco-friendly materials and supporting fair wages
                for all artisans and workers in our supply chain.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-amber-700 mr-2" />
                <h3 className="text-xl font-medium">Innovation</h3>
              </div>
              <p className="text-gray-700">
                While honoring tradition, we continuously explore new designs, techniques, and technologies to create
                fashion that resonates with the modern consumer.
              </p>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                <Image
                  src="/indian-woman-portrait.png"
                  alt="Priya Sharma - Founder & CEO"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-medium text-lg">Priya Sharma</h3>
              <p className="text-gray-600">Founder & CEO</p>
            </div>

            <div className="text-center">
              <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                <Image
                  src="/indian-man-portrait.png"
                  alt="Raj Malhotra - Creative Director"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-medium text-lg">Raj Malhotra</h3>
              <p className="text-gray-600">Creative Director</p>
            </div>

            <div className="text-center">
              <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                <Image
                  src="/professional-indian-woman.png"
                  alt="Anjali Patel - Head of Design"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-medium text-lg">Anjali Patel</h3>
              <p className="text-gray-600">Head of Design</p>
            </div>

            <div className="text-center">
              <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                <Image
                  src="/professional-indian-man.png"
                  alt="Vikram Singh - Operations Manager"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-medium text-lg">Vikram Singh</h3>
              <p className="text-gray-600">Operations Manager</p>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-center">Our Journey</h2>
          <div className="space-y-8">
            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className="rounded-full bg-amber-700 text-white w-10 h-10 flex items-center justify-center">1</div>
                <div className="h-full w-0.5 bg-amber-700"></div>
              </div>
              <div className="pb-8">
                <h3 className="text-xl font-medium">2010: The Beginning</h3>
                <p className="text-gray-700 mt-2">
                  Your Fashion Store was founded as a small boutique in New Delhi, focusing on handcrafted ethnic wear.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className="rounded-full bg-amber-700 text-white w-10 h-10 flex items-center justify-center">2</div>
                <div className="h-full w-0.5 bg-amber-700"></div>
              </div>
              <div className="pb-8">
                <h3 className="text-xl font-medium">2015: Expansion</h3>
                <p className="text-gray-700 mt-2">
                  We opened three more stores across major cities in India and launched our first e-commerce website.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className="rounded-full bg-amber-700 text-white w-10 h-10 flex items-center justify-center">3</div>
                <div className="h-full w-0.5 bg-amber-700"></div>
              </div>
              <div className="pb-8">
                <h3 className="text-xl font-medium">2018: International Recognition</h3>
                <p className="text-gray-700 mt-2">
                  Our designs were featured in international fashion shows, and we began shipping worldwide.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className="rounded-full bg-amber-700 text-white w-10 h-10 flex items-center justify-center">4</div>
              </div>
              <div>
                <h3 className="text-xl font-medium">2023: Today</h3>
                <p className="text-gray-700 mt-2">
                  We continue to grow our collection while staying true to our mission of celebrating Indian
                  craftsmanship and sustainable fashion.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
