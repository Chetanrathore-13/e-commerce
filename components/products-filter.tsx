"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import type { IBrand, ICategory } from "@/lib/models"

interface ProductsFilterProps {
  brands: IBrand[]
  categories: ICategory[]
}

export function ProductsFilter({ brands, categories }: ProductsFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [name, setName] = useState(searchParams.get("name") || "")
  const [brandId, setBrandId] = useState(searchParams.get("brand_id") || "")
  const [categoryId, setCategoryId] = useState(searchParams.get("category_id") || "")
  const [date, setDate] = useState<Date | undefined>(
    searchParams.get("date") ? new Date(searchParams.get("date") as string) : undefined,
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams.toString())

    if (name) {
      params.set("name", name)
    } else {
      params.delete("name")
    }

    if (brandId) {
      params.set("brand_id", brandId)
    } else {
      params.delete("brand_id")
    }

    if (categoryId) {
      params.set("category_id", categoryId)
    } else {
      params.delete("category_id")
    }

    if (date) {
      params.set("date", date.toISOString().split("T")[0])
    } else {
      params.delete("date")
    }

    // Reset to page 1 when filtering
    params.set("page", "1")

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleReset = () => {
    setName("")
    setBrandId("")
    setCategoryId("")
    setDate(undefined)

    const params = new URLSearchParams(searchParams.toString())
    params.delete("name")
    params.delete("brand_id")
    params.delete("category_id")
    params.delete("date")
    params.set("page", "1")

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-col gap-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by product name..."
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

        <Select value={brandId} onValueChange={setBrandId}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand._id.toString()} value={brand._id.toString()}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category._id.toString()} value={category._id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Filter by date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex gap-2">
        <Button type="submit">Apply Filters</Button>
        <Button type="button" variant="outline" onClick={handleReset}>
          Reset Filters
        </Button>
      </div>
    </form>
  )
}
