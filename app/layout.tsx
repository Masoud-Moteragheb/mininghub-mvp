import "./globals.css";
import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "MiningHub • MVP",
  description: "A professional network for mining & water engineers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <SiteHeader />
        <main className="max-w-5xl mx-auto p-6">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
