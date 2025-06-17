import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import NextAuthSessionProvider from "@/components/session-provider";
import LayoutWrapper from "@/components/layout-wrapper";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/contexts/cart-context";
import { WishlistProvider } from "@/contexts/wishlist-context";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning={true}>
          <NextAuthSessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
              enableColorScheme={true}
            >
              <CartProvider>
                <WishlistProvider>
              <Header /> {/* Role-based logic should be inside Header */}
              <LayoutWrapper>{children}</LayoutWrapper>
              <Footer /> {/* Role-based logic should be inside Footer */}
                </WishlistProvider>
                </CartProvider>
            </ThemeProvider>
          </NextAuthSessionProvider>
          <Toaster />
        </body>
      </html>
    </Suspense>
  );
}
