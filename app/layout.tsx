import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { CursorProvider } from "@/components/ui/Cursor";


const title = "Vaibhav Tomar — Design Engineer & Software Developer";
const description =
  "Vaibhav Tomar is a design engineer and software developer in India, building fast, playful web experiences with Next.js, React and GSAP. See projects and get in touch.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: "/" },
  // archived site: vaibhavtomar.com (portfolio-v3) is the one that should rank, so keep v2 out of the index
  robots: { index: false, follow: true },
  // In public/, not app/icon.svg: next.config sends every .svg through @svgr, which breaks the metadata icon loader
  // PNG + /favicon.ico for Google's favicon crawler (wants a square raster, multiple of 48px)
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-96.png", type: "image/png", sizes: "96x96" },
    ],
  },
  keywords: [
    "Vaibhav Tomar",
    "Vaibhav91one",
    "Design Engineer",
    "Software Developer",
    "Frontend Developer",
    "Next.js",
    "React",
    "GSAP",
    "Portfolio",
  ],
  authors: [{ name: "Vaibhav Tomar", url: SITE_URL }],
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@VrsatileVaibhav",
    images: ["/assets/Images/opengraph.jpg"],
  },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: "Vaibhav Tomar",
    title,
    description,
    images: [
      {
        url: "/assets/Images/opengraph.jpg",
        width: 2400,
        height: 1260,
        alt: "Vaibhav Tomar — Design Engineer & Software Developer",
      },
    ],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // overscroll-y-none on html + body stops the macOS/iOS rubber-band bounce (Chrome reads body,
  // Safari/Firefox read html); -y only, so the two-finger swipe for back/forward still works.
  return (
    <html lang="en" className="overscroll-y-none" suppressHydrationWarning>
      <head>
        {/* Repeat visit: hide the preloader before first paint (no flash of "Welcome") */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("seenPreloader"))document.documentElement.dataset.seen="1"}catch(e){}`,
          }}
        />
      </head>
      {/* suppressHydrationWarning: extensions (e.g. ColorZilla) add attributes to <body> before React hydrates */}
      <body className="antialiased overscroll-y-none" suppressHydrationWarning>
        <CursorProvider>{children}</CursorProvider>
      </body>
    </html>
  );
}
