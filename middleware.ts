import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  // const { pathname } = request.nextUrl

  // // Check if the request is for a variation image
  // if (pathname.startsWith("/variations/")) {
  //   // Redirect to the correct path with /uploads prefix
  //   const newUrl = request.nextUrl.clone()
  //   newUrl.pathname = `/uploads${pathname}`
  //   return NextResponse.redirect(newUrl)
  // }

  // // Check if the request is for an admin route
  // if (pathname.startsWith("/admin")) {
  //   const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  //   // If not logged in or not an admin, redirect to login
  //   if (!token || token.role !== "admin") {
  //     const url = new URL("/login", request.url)
  //     url.searchParams.set("callbackUrl", encodeURI(request.url))
  //     return NextResponse.redirect(url)
  //   }
  // }

  // // Check if the request is for a dashboard route
  // if (pathname.startsWith("/dashboard")) {
  //   const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  //   // If not logged in, redirect to login
  //   if (!token) {
  //     const url = new URL("/login", request.url)
  //     url.searchParams.set("callbackUrl", encodeURI(request.url))
  //     return NextResponse.redirect(url)
  //   }

  //   // IMPORTANT: Remove any redirection from /dashboard/orders to /admin/orders
  //   // This was likely causing the issue
  // }

  return NextResponse.next()
}

export const config = {
  matcher: ["/variations/:path*", "/admin/:path*", "/dashboard/:path*"],
}
