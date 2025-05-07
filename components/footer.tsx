import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"
import Logo from "../public/Logo/Parpra.png";
export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12">


        {/* Newsletter */}
        <div className="border-b border-gray-200 mt-12 mb-10 pt-8 pb-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold mb-2">Subscribe to our newsletter</h3>
            <p className="text-gray-600 mb-4">Stay updated with our latest collections and exclusive offers</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-800"
              />
              <button className="bg-teal-800 text-white px-4 py-2 rounded-r-md hover:bg-teal-700 transition duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <Link href="/">
              <Image src={Logo} alt="PARPRA" width={150} height={50} />
            </Link>
            <p className="text-gray-600 mt-4">
              Discover the elegance of Indian ethnic wear with our curated collection of traditional and contemporary
              designs.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-800 hover:text-teal-600"
              >
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-800 hover:text-teal-600"
              >
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-800 hover:text-teal-600"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-800 hover:text-teal-600"
              >
                <Youtube size={20} />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-teal-800">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-teal-800">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-teal-800">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-teal-800">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-600 hover:text-teal-800">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-teal-800">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/women/sarees" className="text-gray-600 hover:text-teal-800">
                  Sarees
                </Link>
              </li>
              <li>
                <Link href="/women/lehenga" className="text-gray-600 hover:text-teal-800">
                  Lehenga
                </Link>
              </li>
              <li>
                <Link href="/women/salwar-kameez" className="text-gray-600 hover:text-teal-800">
                  Salwar Kameez
                </Link>
              </li>
              <li>
                <Link href="/women/gowns" className="text-gray-600 hover:text-teal-800">
                  Gowns
                </Link>
              </li>
              <li>
                <Link href="/men/sherwanis" className="text-gray-600 hover:text-teal-800">
                  Sherwanis
                </Link>
              </li>
              <li>
                <Link href="/men/kurta-pyjama" className="text-gray-600 hover:text-teal-800">
                  Kurta Pyjama
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-teal-800 mr-2 mt-0.5" />
                <span className="text-gray-600">123 Fashion Street, Bangalore, Karnataka, India - 560001</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-teal-800 mr-2" />
                <a href="tel:+919876543210" className="text-gray-600 hover:text-teal-800">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-teal-800 mr-2" />
                <a href="mailto:info@parpra.com" className="text-gray-600 hover:text-teal-800">
                  info@parpra.com
                </a>
              </li>
            </ul>
          </div>
        </div>


        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600">© {new Date().getFullYear()} PARPRA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
