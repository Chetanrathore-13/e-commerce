"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

export function BrandsFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [name, setName] = useState(searchParams.get("name") || "")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams.toString())

    if (name) {
      params.set("name", name)
    } else {
      params.delete("name")
    }

    // Reset to page 1 when filtering
    params.set("page", "1")

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleReset = () => {
    setName("")

    const params = new URLSearchParams(searchParams.toString())
    params.delete("name")
    params.set("page", "1")

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-6">
      <div className="flex-1 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by brand name..."
            className="pl-8"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {name && (
            <button
              type="button"
              onClick={() => setName("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear</span>
            </button>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit">Filter</Button>
        <Button type="button" variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </form>
  )
}
