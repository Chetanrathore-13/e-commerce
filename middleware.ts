import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
        const { pathname } = request.nextUrl;
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

        // Redirect variation image URLs
        if (pathname.startsWith("/variations/")) {
                const newUrl = request.nextUrl.clone();
                newUrl.pathname = `/uploads${pathname}`;
                return NextResponse.redirect(newUrl);
        }

        // Protect /admin routes
        if (pathname.startsWith("/admin")) {
                if (!token || token.role !== "admin") {
                        const url = new URL("/login", request.url);
                        url.searchParams.set("callbackUrl", encodeURI(request.url));
                        return NextResponse.redirect(url);
                }
        }

        // Protect /dashboard routes (allow both admin and user)
        if (pathname.startsWith("/dashboard")) {
                if (!token || !["admin", "user"].includes(token.role)) {
                        const url = new URL("/login", request.url);
                        url.searchParams.set("callbackUrl", encodeURI(request.url));
                        return NextResponse.redirect(url);
                }
        }

        return NextResponse.next();
}

export const config = {
        matcher: ["/variations/:path*", "/admin/:path*", "/dashboard/:path*"],
};
