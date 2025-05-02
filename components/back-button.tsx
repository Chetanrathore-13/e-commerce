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
    products: "bg-blue-600 hover:bg-blue-700",
    categories: "bg-emerald-600 hover:bg-emerald-700",
    brands: "bg-amber-600 hover:bg-amber-700",
    variations: "bg-purple-600 hover:bg-purple-700",
  }

  return (
    <Button onClick={() => router.back()} className={`${sectionColors[section]} text-white`} size="sm">
      <ArrowLeft className="mr-2 h-4 w-4" />
      {label}
    </Button>
  )
}
