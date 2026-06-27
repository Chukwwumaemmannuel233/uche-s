import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { CartProvider } from "@/components/cart-provider";
import { WhatsAppFloat } from "@/components/site-shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.uchesgadgethub.com"
  ),
  title: {
    default: "Uche's Gadget Hub | Appliances, Electronics and Gadgets",
    template: "%s | Uche's Gadget Hub",
  },
  description:
    "A premium storefront for home appliances, electronics, gadgets, delivery, and installation.",
  keywords: [
    "Uche's Gadget Hub",
    "Abuja electronics store",
    "home appliances Abuja",
    "gadgets Nigeria",
    "televisions",
    "phones",
    "laptops",
  ],
  openGraph: {
    title: "Uche's Gadget Hub",
    description:
      "Shop gadgets, electronics, home appliances, delivery, and setup support in Abuja.",
    url: "/",
    siteName: "Uche's Gadget Hub",
    images: [
      {
        url: "/images/icon.png",
        width: 1200,
        height: 630,
        alt: "Uche's Gadget Hub electronics and appliances",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Uche's Gadget Hub",
    description:
      "Shop gadgets, electronics, home appliances, delivery, and setup support in Abuja.",
    images: ["/images/cutouts/tcl-tv-cutout.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <CartProvider>
          {children}
          <WhatsAppFloat />
        </CartProvider>
        <Toaster richColors position="top-right" />
        </body>
    </html>
  );
}
