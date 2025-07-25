import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/auth";
import UserProvider from "@/providers/user";
import NavbarWrapper from "@/components/navbar";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Seconds - Schedule Countdown Events Easily",
  description:
    "Seconds helps you schedule and share countdowns for your important events.",
  openGraph: {
    title: "Seconds - Schedule Countdown Events Easily",
    description:
      "Seconds helps you schedule and share countdowns for your important events.",
    url: "https://seconds-site.vercel.app", // Replace with your actual URL
    siteName: "Seconds",
    images: [
      {
        url: "https://seconds-site.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Seconds countdown scheduling",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
  canonical: "https://seconds-site.vercel.app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={metadata.canonical} />

        {/* Open Graph tags */}
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta
          property="og:description"
          content={metadata.openGraph.description}
        />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:site_name" content={metadata.openGraph.siteName} />
        <meta property="og:locale" content={metadata.openGraph.locale} />
        {metadata.openGraph.images.map(({ url, width, height, alt }, i) => (
          <meta key={i} property="og:image" content={url} />
        ))}

        {/* Favicon */}
        <link rel="icon" href="/icon.svg" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <UserProvider>
            <NavbarWrapper>{children}</NavbarWrapper>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
