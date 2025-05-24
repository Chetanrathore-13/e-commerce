"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface BackButtonProps {
  label?: string
  section: "products" | "categories" | "brands" | "variations"
}

export function BackButton({ label = "Back", section }: BackButtonProps) {
  const router = useRouter()

  // Define unique colors for each section
  const sectionColors = {
    products: "bg-black hover:bg-teal-600",
    categories: "bg-black hover:bg-teal-700",
    brands: "bg-black hover:bg-teal-700",
    variations: "bg-blackhover:bg-teal-700",
  }

  return (
    <Button onClick={() => router.back()} className={`${sectionColors[section]} text-white`} size="sm">
      <ArrowLeft className="h-4 w-4 text-md " />
      {label}
    </Button>
  )
}
