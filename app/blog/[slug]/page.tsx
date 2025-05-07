import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ChevronRight, Calendar, User, Tag, Share2, Facebook, Twitter, Linkedin } from "lucide-react"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${slug}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      return {
        title: "Blog Post - PARPRA",
        description: "Read our latest fashion insights and styling tips.",
      }
    }

    const { blog } = await res.json()

    return {
      title: blog.meta_title || `${blog.title} - PARPRA Blog`,
      description: blog.meta_description || blog.excerpt,
      openGraph: {
        images: [{ url: blog.featured_image }],
      },
    }
  } catch (error) {
    return {
      title: "Blog Post - PARPRA",
      description: "Read our latest fashion insights and styling tips.",
    }
  }
}

async function getBlogPost(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${slug}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      return null
    }

    return res.json()
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error)
    return null
  }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = params
  const data = await getBlogPost(slug)

  if (!data || !data.blog) {
    notFound()
  }

  const { blog, relatedBlogs } = data

  return (
    <div className="bg-neutral-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm mb-8">
          <Link href="/" className="text-gray-500 hover:text-amber-700">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          <Link href="/blog" className="text-gray-500 hover:text-amber-700">
            Blog
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          <span className="text-gray-900 truncate max-w-[200px]">{blog.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Image */}
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-8">
              <Image
                src={blog.featured_image || "/placeholder.svg"}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Blog Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-light mb-4">{blog.title}</h1>

              <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {new Date(blog.publish_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>{blog.author}</span>
                </div>
                {blog.categories.length > 0 && (
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    <span>{blog.categories.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Blog Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag: string) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600 hover:bg-amber-100 hover:text-amber-700"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="border-t border-b py-6 mb-8">
              <div className="flex items-center flex-wrap gap-4">
                <span className="font-medium flex items-center">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share this post:
                </span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Facebook className="h-4 w-4" />
                    <span className="sr-only">Share on Facebook</span>
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Twitter className="h-4 w-4" />
                    <span className="sr-only">Share on Twitter</span>
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Linkedin className="h-4 w-4" />
                    <span className="sr-only">Share on LinkedIn</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Related Posts */}
            {relatedBlogs && relatedBlogs.length > 0 && (
              <div>
                <h2 className="text-2xl font-light mb-6">Related Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedBlogs.map((relatedBlog: any) => (
                    <Link
                      key={relatedBlog._id}
                      href={`/blog/${relatedBlog.slug}`}
                      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                    >
                      <div className="relative h-48">
                        <Image
                          src={relatedBlog.featured_image || "/placeholder.svg"}
                          alt={relatedBlog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium mb-2 group-hover:text-amber-700 transition-colors line-clamp-2">
                          {relatedBlog.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{relatedBlog.excerpt}</p>
                        <div className="text-xs text-gray-500">
                          {new Date(relatedBlog.publish_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h2 className="text-xl font-medium mb-4">Recent Posts</h2>
              <div className="space-y-4 mb-8">
                {/* This would typically fetch recent posts from an API */}
                <div className="text-center p-8">
                  <Link href="/blog" className="text-amber-700 hover:underline">
                    View all posts
                  </Link>
                </div>
              </div>

              {/* Categories */}
              <h2 className="text-xl font-medium mb-4">Categories</h2>
              <ul className="space-y-2 mb-8">
                {blog.categories.map((category: string) => (
                  <li key={category}>
                    <Link
                      href={`/blog?category=${encodeURIComponent(category)}`}
                      className="text-gray-600 hover:text-amber-700"
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
