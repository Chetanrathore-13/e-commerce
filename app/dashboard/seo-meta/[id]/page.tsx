"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface SeoMeta {
  _id: string
  page: string
  title: string
  description: string
  keywords: string[]
  og_title?: string
  og_description?: string
  og_image?: string
  og_url?: string
  twitter_title?: string
  twitter_description?: string
  twitter_image?: string
  twitter_card?: string
  canonical_url?: string
  robots?: string
  schema_markup?: string
  is_active: boolean
}

export default function EditSeoMetaPage({ params }: { params: Promise<{ id: string }> }) {
  const [seoMeta, setSeoMeta] = useState<SeoMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [keywordInput, setKeywordInput] = useState("")
  const [seoMetaId, setSeoMetaId] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params
      setSeoMetaId(resolvedParams.id)
    }
    fetchParams()
  }, [params])
  const pageTypes = ["homepage", "products", "categories", "about", "contact", "blog", "cart", "checkout"]

  const twitterCardTypes = ["summary", "summary_large_image", "app", "player"]

  const fetchSeoMeta = useCallback( async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/seo-meta/${seoMetaId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch SEO meta data")
      }

      setSeoMeta(data.seoMeta)
    } catch (error) {
      console.error("Error fetching SEO meta data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch SEO meta data",
        variant: "destructive",
      })
      router.push("/dashboard/seo-meta")
    } finally {
      setLoading(false)
    }
  }, [seoMetaId, toast, router])

  useEffect(() => {
    fetchSeoMeta()
  }, [seoMetaId, toast, router, fetchSeoMeta])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!seoMeta) return

    try {
      setSaving(true)
      const response = await fetch(`/api/admin/seo-meta/${seoMetaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(seoMeta),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update SEO meta data")
      }

      toast({
        title: "Success",
        description: "SEO meta data updated successfully",
        variant: "success",
      })

      router.push("/dashboard/seo-meta")
    } catch (error) {
      console.error("Error updating SEO meta data:", error)
      toast({
        title: "Error",
        description: "Failed to update SEO meta data",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const addKeyword = () => {
    if (keywordInput.trim() && seoMeta) {
      setSeoMeta({
        ...seoMeta,
        keywords: [...seoMeta.keywords, keywordInput.trim()],
      })
      setKeywordInput("")
    }
  }

  const removeKeyword = (index: number) => {
    if (seoMeta) {
      setSeoMeta({
        ...seoMeta,
        keywords: seoMeta.keywords.filter((_, i) => i !== index),
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="space-y-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!seoMeta) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">SEO meta data not found</p>
          <Link href="/dashboard/seo-meta">
            <Button className="mt-4">Back to SEO Meta</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/seo-meta">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit SEO Meta Data</h1>
            <p className="text-gray-600 mt-1">Update SEO meta tags for {seoMeta.page} page</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="page">Page Type *</Label>
                <Select value={seoMeta.page} onValueChange={(value) => setSeoMeta({ ...seoMeta, page: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select page type" />
                  </SelectTrigger>
                  <SelectContent>
                    {pageTypes.map((page) => (
                      <SelectItem key={page} value={page}>
                        {page.charAt(0).toUpperCase() + page.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={seoMeta.is_active}
                  onCheckedChange={(checked) => setSeoMeta({ ...seoMeta, is_active: checked })}
                />
                <Label htmlFor="is_active" className="flex items-center gap-2">
                  {seoMeta.is_active ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                  {seoMeta.is_active ? "Active" : "Inactive"}
                </Label>
              </div>
            </div>
          </div>

          {/* SEO Meta Tags */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">SEO Meta Tags</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title * (Max 60 characters)</Label>
                <Input
                  id="title"
                  value={seoMeta.title}
                  onChange={(e) => setSeoMeta({ ...seoMeta, title: e.target.value })}
                  maxLength={60}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">{seoMeta.title.length}/60 characters</p>
              </div>
              <div>
                <Label htmlFor="description">Description * (Max 160 characters)</Label>
                <Textarea
                  id="description"
                  value={seoMeta.description}
                  onChange={(e) => setSeoMeta({ ...seoMeta, description: e.target.value })}
                  maxLength={160}
                  rows={3}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">{seoMeta.description.length}/160 characters</p>
              </div>
              <div>
                <Label>Keywords</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="Add keyword"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                  />
                  <Button type="button" onClick={addKeyword} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {seoMeta.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer">
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="canonical_url">Canonical URL</Label>
                  <Input
                    id="canonical_url"
                    value={seoMeta.canonical_url || ""}
                    onChange={(e) => setSeoMeta({ ...seoMeta, canonical_url: e.target.value })}
                    placeholder="https://example.com/page"
                  />
                </div>
                <div>
                  <Label htmlFor="robots">Robots</Label>
                  <Input
                    id="robots"
                    value={seoMeta.robots || ""}
                    onChange={(e) => setSeoMeta({ ...seoMeta, robots: e.target.value })}
                    placeholder="index, follow"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Open Graph Tags */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Open Graph Tags</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="og_title">OG Title</Label>
                <Input
                  id="og_title"
                  value={seoMeta.og_title || ""}
                  onChange={(e) => setSeoMeta({ ...seoMeta, og_title: e.target.value })}
                  maxLength={60}
                />
              </div>
              <div>
                <Label htmlFor="og_description">OG Description</Label>
                <Textarea
                  id="og_description"
                  value={seoMeta.og_description || ""}
                  onChange={(e) => setSeoMeta({ ...seoMeta, og_description: e.target.value })}
                  maxLength={160}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="og_image">OG Image URL</Label>
                  <Input
                    id="og_image"
                    value={seoMeta.og_image || ""}
                    onChange={(e) => setSeoMeta({ ...seoMeta, og_image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="og_url">OG URL</Label>
                  <Input
                    id="og_url"
                    value={seoMeta.og_url || ""}
                    onChange={(e) => setSeoMeta({ ...seoMeta, og_url: e.target.value })}
                    placeholder="https://example.com/page"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Twitter Card Tags */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Twitter Card Tags</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="twitter_card">Twitter Card Type</Label>
                <Select
                  value={seoMeta.twitter_card || "summary_large_image"}
                  onValueChange={(value) => setSeoMeta({ ...seoMeta, twitter_card: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select card type" />
                  </SelectTrigger>
                  <SelectContent>
                    {twitterCardTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace("_", " ").toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="twitter_title">Twitter Title</Label>
                <Input
                  id="twitter_title"
                  value={seoMeta.twitter_title || ""}
                  onChange={(e) => setSeoMeta({ ...seoMeta, twitter_title: e.target.value })}
                  maxLength={60}
                />
              </div>
              <div>
                <Label htmlFor="twitter_description">Twitter Description</Label>
                <Textarea
                  id="twitter_description"
                  value={seoMeta.twitter_description || ""}
                  onChange={(e) => setSeoMeta({ ...seoMeta, twitter_description: e.target.value })}
                  maxLength={160}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="twitter_image">Twitter Image URL</Label>
                <Input
                  id="twitter_image"
                  value={seoMeta.twitter_image || ""}
                  onChange={(e) => setSeoMeta({ ...seoMeta, twitter_image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          {/* Schema Markup */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Schema Markup (JSON-LD)</h2>
            <div>
              <Label htmlFor="schema_markup">Schema JSON</Label>
              <Textarea
                id="schema_markup"
                value={seoMeta.schema_markup || ""}
                onChange={(e) => setSeoMeta({ ...seoMeta, schema_markup: e.target.value })}
                rows={6}
                placeholder='{"@context": "https://schema.org", "@type": "WebPage", ...}'
                className="font-mono text-sm"
              />
              <p className="text-sm text-gray-500 mt-1">Enter valid JSON-LD schema markup</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link href="/dashboard/seo-meta">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={saving} className="bg-teal-700 hover:bg-teal-800">
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
