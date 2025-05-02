import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@smastrom/react-rating/style.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import NavBar from "@/app/components/layout/NavBar";
import { AuthProvider } from './context/AuthContext';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Prevent Font Awesome from adding its CSS since we did it manually above
config.autoAddCss = false

export const metadata: Metadata = {
  title: "BluStyles | Professional Hair Salon & Styling Services",
  description: "Book professional hair styling, coloring, and beauty services at BluStyles. Expert stylists, convenient booking, and exceptional results.",
  keywords: "hair salon, styling, haircut, coloring, beauty services, booking",
  openGraph: {
    title: "BluStyles | Professional Hair Salon & Styling Services",
    description: "Book professional hair styling, coloring, and beauty services at BluStyles. Expert stylists, convenient booking, and exceptional results.",
    url: "https://blustyles.com",
    siteName: "BluStyles Salon",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BluStyles | Professional Hair Salon & Styling Services",
    description: "Book professional hair styling, coloring, and beauty services at BluStyles",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://blustyles.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <NavBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
