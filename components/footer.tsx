import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Award,
  CreditCard,
  HandMetal,
} from "lucide-react";

import Logo from "../public/Logo/Parpra.png";
export default function Footer() {
  const features = [
    {
      icon: MapPin,
      title: "MADE IN INDIA",
      description: "Authentic products crafted in India",
    },
    {
      icon: Award,
      title: "ASSURED QUALITY",
      description: "Premium quality guaranteed",
    },
    {
      icon: CreditCard,
      title: "SECURE PAYMENTS",
      description: "Safe and protected transactions",
    },
    {
      icon: HandMetal,
      title: "EMPOWERING WEAVERS",
      description: "Supporting local artisans and communities",
    },
  ];

  return (
    <footer className="bg-white border-t w-full">
      {/* Features Section */}
      <div className="w-full bg-white py-8 md:py-12 border-b border-gray-200">
        <div className="px-4 max-w-screen-xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 flex items-center justify-center mb-3">
                  <feature.icon
                    className="w-12 h-12 text-teal-800"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-teal-800 font-medium text-sm md:text-base">
                  {feature.title}
                </h3>
                <p className="text-teal-800 text-xs mt-1 hidden md:block">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="w-full border-b border-gray-200 py-8">
        <div className="max-w-xl mx-auto text-center px-4">
          <h3 className="text-lg font-semibold mb-2">
            Subscribe to our newsletter
          </h3>
          <p className="text-gray-600 mb-4">
            Stay updated with our latest collections and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <input
              type="text"
              placeholder="Your name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-800"
            />
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-800"
            />
            <button className="bg-teal-800 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition duration-200 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="w-full bg-teal-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-4 py-10 max-w-screen-xl mx-auto">
          {/* Logo and About */}
          <div className="space-y-4">
            <Link href="/">
              <Image src={Logo} alt="PARPRA" width={150} height={50} />
            </Link>
            <p className="text-white mt-4">
              Discover the elegance of Indian ethnic wear with our curated
              collection of traditional and contemporary designs.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
              >
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
              >
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
              >
                <Youtube size={20} />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-white hover:text-teal-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white hover:text-teal-300"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white hover:text-teal-300">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-white hover:text-teal-300"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-white hover:text-teal-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white hover:text-teal-300">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Categories
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/women/sarees"
                  className="text-white hover:text-teal-300"
                >
                  Sarees
                </Link>
              </li>
              <li>
                <Link
                  href="/women/lehenga"
                  className="text-white hover:text-teal-300"
                >
                  Lehenga
                </Link>
              </li>
              <li>
                <Link
                  href="/women/salwar-kameez"
                  className="text-white hover:text-teal-300"
                >
                  Salwar Kameez
                </Link>
              </li>
              <li>
                <Link
                  href="/women/gowns"
                  className="text-white hover:text-teal-300"
                >
                  Gowns
                </Link>
              </li>
              <li>
                <Link
                  href="/men/sherwanis"
                  className="text-white hover:text-teal-300"
                >
                  Sherwanis
                </Link>
              </li>
              <li>
                <Link
                  href="/men/kurta-pyjama"
                  className="text-white hover:text-teal-300"
                >
                  Kurta Pyjama
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-white mr-2 mt-0.5" />
                <span className="text-white">
                  123 Fashion Street, Bangalore, Karnataka, India - 560001
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-white mr-2" />
                <a
                  href="tel:+919876543210"
                  className="text-white hover:text-teal-300"
                >
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-white mr-2" />
                <a
                  href="mailto:info@parpra.com"
                  className="text-white hover:text-teal-300"
                >
                  info@parpra.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="w-full border-t border-gray-200 py-6 text-center bg-teal-800">
        <p className="text-white">
          © {new Date().getFullYear()} PARPRA. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
