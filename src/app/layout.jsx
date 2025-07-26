import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/auth";
import UserProvider from "@/providers/user";
import NavbarWrapper from "@/components/navbar";

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
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Seconds - Schedule Countdown Events Easily",
    description:
      "Seconds helps you schedule and share countdowns for your important events.",
    url: "https://seconds-site.vercel.app",
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
