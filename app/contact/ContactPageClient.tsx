"use client"

import Image from "next/image"
import Link from "next/link"
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"

export default function ContactPageClient() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[30vh] md:h-[40vh] overflow-hidden">
        <Image
          src="/placeholder.svg?key=j35at"
          alt="Contact Us Hero"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/70 to-transparent flex items-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              className="max-w-2xl text-white"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
              <p className="text-lg md:text-xl opacity-90">
                We're here to help with any questions or concerns about our products and services.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information Cards */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-1 space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-md p-6 border border-teal-100 hover:border-teal-300 transition-colors">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-teal-700" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
                <address className="not-italic text-gray-600">
                  123 Fashion Street, Suite 100
                  <br />
                  New Delhi, 110001
                  <br />
                  India
                </address>
                <Link
                  href="https://maps.google.com"
                  target="_blank"
                  className="inline-flex items-center text-teal-700 font-medium mt-3 hover:text-teal-800"
                >
                  Get directions
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border border-teal-100 hover:border-teal-300 transition-colors">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-teal-700" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                <p className="text-gray-600 mb-1">Customer Service:</p>
                <Link href="tel:+911234567890" className="text-lg font-medium text-teal-700 hover:text-teal-800">
                  +91 123 456 7890
                </Link>
                <p className="text-gray-600 mt-3 mb-1">Order Support:</p>
                <Link href="tel:+911234567891" className="text-lg font-medium text-teal-700 hover:text-teal-800">
                  +91 123 456 7891
                </Link>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border border-teal-100 hover:border-teal-300 transition-colors">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-teal-700" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                <p className="text-gray-600 mb-1">General Inquiries:</p>
                <Link href="mailto:info@yourfashionstore.com" className="text-teal-700 hover:text-teal-800 break-all">
                  info@yourfashionstore.com
                </Link>
                <p className="text-gray-600 mt-3 mb-1">Customer Support:</p>
                <Link
                  href="mailto:support@yourfashionstore.com"
                  className="text-teal-700 hover:text-teal-800 break-all"
                >
                  support@yourfashionstore.com
                </Link>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border border-teal-100 hover:border-teal-300 transition-colors">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-teal-700" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Business Hours</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="font-medium">10:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-medium">11:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-teal-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                    <MessageSquare className="h-6 w-6 text-teal-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold">Send us a message</h2>
                    <p className="text-gray-600">We'll get back to you as soon as possible</p>
                  </div>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Your Name <span className="text-teal-700">*</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        required
                        className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address <span className="text-teal-700">*</span>
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                        className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="+1 (555) 123-4567"
                        className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                        Subject <span className="text-teal-700">*</span>
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="Order Inquiry"
                        required
                        className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Message <span className="text-teal-700">*</span>
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="How can we help you?"
                      rows={5}
                      required
                      className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-lg"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      id="privacy"
                      name="privacy"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <label htmlFor="privacy" className="ml-2 block text-sm text-gray-700">
                      I agree to the{" "}
                      <Link href="/privacy-policy" className="text-teal-700 hover:text-teal-800">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-teal-700 hover:bg-teal-800 text-white py-3 rounded-lg flex items-center justify-center"
                  >
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>

              {/* Map */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8 bg-white rounded-2xl shadow-md overflow-hidden border border-teal-100"
              >
                <h3 className="text-xl font-semibold p-6 border-b border-gray-100">Find Us</h3>
                <div className="aspect-video relative">
                  <Image src="/placeholder.svg?key=8oj7w" alt="Store Location Map" fill className="object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Link
                      href="https://maps.google.com"
                      target="_blank"
                      className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
                    >
                      Open in Google Maps
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <div className="inline-block px-4 py-1 rounded-full bg-teal-100 text-teal-800 font-medium text-sm mb-4">
              Quick Help
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Find quick answers to common questions about our products and services
            </p>

            <div className="bg-gradient-to-r from-teal-700 to-teal-500 rounded-2xl p-8 text-white text-center">
              <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
              <p className="mb-6">Check our comprehensive FAQ section or reach out to our customer support team</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/faq"
                  className="bg-white text-teal-700 px-6 py-3 rounded-lg font-medium hover:bg-teal-50 transition-colors"
                >
                  Visit FAQ Page
                </Link>
                <Link
                  href="tel:+911234567890"
                  className="bg-teal-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-900 transition-colors"
                >
                  Call Support
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
