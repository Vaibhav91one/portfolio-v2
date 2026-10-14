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
  // In public/, not app/icon.svg: next.config sends every .svg through @svgr, which breaks the metadata icon loader
  icons: { icon: { url: "/icon.svg", type: "image/svg+xml" } },
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

// schema.org Person: lets Google connect the name to this site and the linked profiles
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Vaibhav Tomar",
  url: SITE_URL,
  image: `${SITE_URL}/assets/Images/opengraph.jpg`,
  jobTitle: "Design Engineer",
  worksFor: { "@type": "Organization", name: "Jio Platforms Limited" },
  address: { "@type": "PostalAddress", addressCountry: "IN" },
  sameAs: [
    "https://github.com/Vaibhav91one",
    "https://www.linkedin.com/in/vaibhav-tomar-a6b2b6255/",
    "https://x.com/VrsatileVaibhav",
  ],
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </head>
      {/* suppressHydrationWarning: extensions (e.g. ColorZilla) add attributes to <body> before React hydrates */}
      <body className="antialiased overscroll-y-none" suppressHydrationWarning>
        <CursorProvider>{children}</CursorProvider>
      </body>
    </html>
  );
}
