"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqs: FAQItem[] = [
  {
    question: "How do I track my order?",
    answer:
      "You can track your order by logging into your account and visiting the 'My Orders' section. Click on the specific order to view its current status and tracking information.",
    category: "Orders",
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns within 7 days of delivery for unworn items in their original packaging. Please note that customized items cannot be returned unless there's a manufacturing defect.",
    category: "Returns",
  },
  {
    question: "How do I know which size to order?",
    answer:
      "Each product page includes a detailed size chart. We recommend measuring yourself and comparing with our size chart to find the best fit. If you're between sizes, we suggest sizing up.",
    category: "Sizing",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship to most countries worldwide. International shipping typically takes 7-14 business days depending on the destination. Customs duties and taxes may apply and are the responsibility of the customer.",
    category: "Shipping",
  },
  {
    question: "How can I cancel my order?",
    answer:
      "You can cancel your order within 24 hours of placing it by contacting our customer service team. Once the order has been processed or shipped, it cannot be cancelled, but you can return it according to our return policy.",
    category: "Orders",
  },
  {
    question: "Are the colors of the products accurate in the photos?",
    answer:
      "We make every effort to display the colors of our products accurately, but colors may appear differently on different screens. If you're concerned about the exact shade, please contact our customer service team.",
    category: "Products",
  },
  {
    question: "How do I care for my ethnic wear?",
    answer:
      "Most of our ethnic wear requires dry cleaning only. For specific care instructions, please refer to the product description or the care label attached to the garment.",
    category: "Products",
  },
  {
    question: "Can I modify my order after placing it?",
    answer:
      "Order modifications are possible within 12 hours of placing the order, subject to processing status. Please contact our customer service team immediately if you need to make changes.",
    category: "Orders",
  },
  {
    question: "Do you offer customization services?",
    answer:
      "Yes, we offer customization for select products. Options include size adjustments, color variations, and embroidery modifications. Customization may extend the delivery time by 7-14 days.",
    category: "Products",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept credit/debit cards, net banking, UPI, wallets, and cash on delivery (for orders within India). All online payments are processed through secure payment gateways.",
    category: "Payment",
  },
  {
    question: "How long will it take to receive my order?",
    answer:
      "Domestic orders typically take 3-5 business days for delivery. For international orders, delivery times range from 7-14 business days depending on the destination country.",
    category: "Shipping",
  },
  {
    question: "What if my order arrives damaged?",
    answer:
      "If your order arrives damaged, please contact our customer service team within 24 hours of delivery with photos of the damaged items. We'll arrange for a replacement or refund.",
    category: "Returns",
  },
]

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({})

  const categories = Array.from(new Set(faqs.map((faq) => faq.category)))

  const toggleCategory = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category)
  }

  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const filteredFaqs = activeCategory ? faqs.filter((faq) => faq.category === activeCategory) : faqs

  return (
    <div className="bg-neutral-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-light text-center mb-8">Frequently Asked Questions</h1>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              className={`px-4 py-2 rounded-full text-sm ${
                activeCategory === null ? "bg-teal-700 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveCategory(null)}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeCategory === category ? "bg-teal-700 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQs */}
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <button
                  className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
                  onClick={() => toggleItem(index)}
                >
                  <span className="font-medium">{faq.question}</span>
                  {openItems[index] ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openItems[index] && (
                  <div className="p-4 pt-0 text-gray-600 border-t">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact section */}
          <div className="mt-12 bg-white p-6 rounded-lg shadow-sm text-center">
            <h2 className="text-xl font-medium mb-4">Still have questions?</h2>
            <p className="text-gray-600 mb-6">
              If you couldn't find the answer to your question, please feel free to contact our customer support team.
            </p>
            <Link href="/contact">
              <button className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-2 rounded-md">Contact Us</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
